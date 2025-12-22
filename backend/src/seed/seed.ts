import { db } from "../lib/db";
import { productVariants, products } from "../lib/db/schema";
import { menu } from "./menu.js";

async function seed() {
    for(const product of menu) {
        const [allProducts] = await db
            .insert(products)
            .values({
                "name": product.name,
                ...(product.category && { "category": product.category}),
                ...(product.code && { "code": product.code}),
                ...(product.description && { "description": product.description}),
             })
             .returning()

        for(const variant of product.variants) {
            await db.insert(productVariants).values({ 
                "price": variant.price, 
                "productId": allProducts.id,
                ...(variant.name && { "name": variant.name }) 
            })
        }
    }

    process.exit(0);
}

seed().catch((err) => {
    console.log(err);
    process.exit(1);
})