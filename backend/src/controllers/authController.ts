import { Request, Response } from 'express';
import type { NewUser } from '../lib/db/schema';
import config from '../config/config';
import { findUserByUserID, findUserByUsername } from '../lib/db/queries/users';
import { checkPasswordHash, makeRefreshToken, makeJWT, hashPassword } from '../lib/auth';
import { createRefreshToken, deleteRefreshToken } from '../lib/db/queries/auth';
import { createUser } from '../lib/db/queries/users';
import { getRefreshToken } from '../lib/db/queries/auth';

export async function login(req: Request, res: Response ) {
    type parameter = {
        password: string,
        username: string,
    }

    const params: parameter = req.body;
    const user = await findUserByUsername(params.username);

    if (!user) return res.sendStatus(401)

    const isSame = await checkPasswordHash(params.password, user.hashedPassword)

    if (!isSame) return res.sendStatus(401)

    type response = Omit<NewUser, "hashedPassword"> & { accessToken: string, refreshToken: string };

    const token = makeJWT(user, config.api.secret);
    const refreshToken = makeRefreshToken();

    const result = await createRefreshToken({ "token": refreshToken, "userId": user.id, "revokedAt": null, expiresAt: new Date(Date.now() + 60 * 1000), }); //* 24 * 60 * 60 
    if (!result) {
        throw new Error("couldn't save token!")
    }

    const cleanedUser: response = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        username: user.username,
        role: user.role,
        accessToken: token,
        refreshToken
    }

    res.json(cleanedUser)
};

export async function register(req: Request, res: Response) {
  type parameter = {
    username: string,
    password: string,
  }

  const role = "waiter";
  const parameter: parameter = req.body;
  const hashedPassword = await hashPassword(parameter.password);
  const response = await createUser({
    username: parameter.username,
    hashedPassword,
    role
  });

  if(!response) return res.sendStatus(409);
  res.status(201).json(response);
};

export async function refreshToken(req: Request, res: Response) {
  type parameter = {
    refreshToken: string
  }

  const parameter: parameter = req.body

  if(parameter.refreshToken == null) return res.sendStatus(401);
  const token = await getRefreshToken(parameter.refreshToken);

  if(!token) return res.sendStatus(401);

  if(token.expiresAt < new Date()) return res.sendStatus(401);

  const userID = token.userId;
  const user = await findUserByUserID(userID);
  const accessToken = makeJWT(user, config.api.secret);

  const response = { accessToken: accessToken }
  res.status(200).json(response)
}

export async function logout(req: Request, res: Response) {
  type parameter = {
    refreshToken: string
  }

  const parameter: parameter = req.body;
  if(parameter.refreshToken == null) return res.sendStatus(401);
  const response = await deleteRefreshToken(parameter.refreshToken);
  if(!response) return res.sendStatus(401)
  res.sendStatus(204)
};

