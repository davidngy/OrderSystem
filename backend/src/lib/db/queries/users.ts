import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  type response = Omit<NewUser, "hashedPassword">
  const cleanedResult: response = {
    id: result.id,
    username: result.username,
    role: result.role,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt
  }
  return cleanedResult;
}

export async function deleteUsers() {
  const result = await db.delete(users);
  return result;
}

export async function findUserByUsername(username: string) {
  const [result] = await db.select()
    .from(users)
    .where(eq(users.username, username));
  return result
}

export async function findUserByUserID(userID: string) {
  const [result] = await db.select()
    .from(users)
    .where(eq(users.id, userID));
  return result
}

export async function UpdateUserCredentials(userID: string, password: string, username: string) {
  return db.update(users)
    .set({
      hashedPassword: password,
      username: username
    })
    .where(eq(users.id, userID))
    .returning();
}
