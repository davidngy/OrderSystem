import { db } from "../index.js";
import { sql } from "drizzle-orm";

async function clearingData() {
  await db.execute(sql`
    TRUNCATE TABLE users, posts, comments
    RESTART IDENTITY CASCADE
  `);
}

