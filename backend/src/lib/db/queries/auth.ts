import { DefaultViewBuilderCore } from "drizzle-orm/gel-core/view.js";
import { db } from "../index.js";
import { NewRefreshToken, refreshTokens } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createRefreshToken(refreshToken: NewRefreshToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .onConflictDoNothing()
    .returning()

  return result
}

export async function revokeRefreshToken(refreshTokenString: string) {
  return db.update(refreshTokens)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(refreshTokens.token, refreshTokenString))
    .returning();
}

export async function getRefreshToken(refreshToken: string) {
    const [result] = await db.select()
            .from(refreshTokens)
            .where(eq(refreshTokens.token, refreshToken))
    return result
}

export async function deleteRefreshToken(refreshToken: string) {
    const [result] = await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken)).returning();
    return result
}