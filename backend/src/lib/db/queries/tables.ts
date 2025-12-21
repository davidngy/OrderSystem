import { db } from "../index.js";
import { tables } from "../schema.js";
import type { NewTable } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createTable(table: NewTable) {
  const [result] = await db
    .insert(tables)
    .values(table)
    .onConflictDoNothing()
    .returning();
  return result
}

export async function getAllTables() {
  const result = await db
    .select()
    .from(tables);
  
  return result
}

export async function getTableByID(tableID: string) {
  const [result] = await db
    .select()
    .from(tables)
    .where(eq(tables.id, tableID));
  
  return result;
}