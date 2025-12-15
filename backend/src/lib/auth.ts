import argon2 from "argon2"
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { randomBytes } from "node:crypto";

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string) {
  if (!password) return false;
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, secret: string): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 20; //3600 1hour

  const payload: payload = {
    "sub": userID,
    iat,
    exp
  }

  const token = jwt.sign(payload, secret, { algorithm: "HS256" });
  return token
}

export function validateJWT(tokenString: string, secret: string) {
  let decoded: payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (e) {
    throw new Error("Invalid token");
  }

  if (!decoded.sub) {
    throw new Error("No user ID in token");
  }

  return decoded.sub;
}


export function makeRefreshToken() {
  const buf = randomBytes(32);
  const refreshToken = buf.toString('hex');
  return refreshToken;
}