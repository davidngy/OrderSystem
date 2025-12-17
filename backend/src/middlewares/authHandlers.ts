import { Request, Response, NextFunction } from 'express';
import { validateJWT } from '../lib/auth';
import config from '../config/config';

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    role?: "admin" | "waiter";
  }
}
export function authorizeToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];
  if(!token) return res.sendStatus(401);

  try {
    const payload = validateJWT(token, config.api.secret)
    if (
      typeof payload.sub !== "string" ||
      (payload.role !== "admin" && payload.role !== "waiter")
    ) {
      return res.sendStatus(401);
    }
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.sendStatus(401)
  }
}