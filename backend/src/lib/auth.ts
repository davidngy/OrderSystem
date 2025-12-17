import argon2 from "argon2"
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { randomBytes } from "node:crypto";
import type { NewUser } from "./db/schema";

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

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp"> & { "role": string};

export function makeJWT(user: NewUser, secret: string): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 20; //3600 1hour

  const payload: payload = {
    "sub": user.id,
    "role": user.role,
    iat,
    exp,
  }

  const token = jwt.sign(payload, secret, { algorithm: "HS256" });
  return token
}

export function validateJWT(tokenString: string, secret: string) {
  let decoded;
  try {
    decoded = jwt.verify(tokenString, secret) as payload;
  } catch (e) {
    throw new Error("Invalid token");
  }

  if(!decoded.sub || !decoded.role) throw new Error("invalid payload")

  return decoded as payload
}


export function makeRefreshToken() {
  const buf = randomBytes(32);
  const refreshToken = buf.toString('hex');
  return refreshToken;
}