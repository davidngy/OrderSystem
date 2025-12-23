import { db } from "../index.js";
import { productVariants, products } from "../schema";
import { eq } from "drizzle-orm";

export async function getRowMenu() {
  const result = await db
    .select()
    .from(products)
    .leftJoin(productVariants, eq(productVariants.productId, products.id));

  return result
}