import { getRowMenu } from "../lib/db/queries/menu";
import type { MenuProduct } from "../seed/menu";
import { Response, Request } from "express";

type MenuItem = MenuProduct & { id: string };

export async function getMenu(req: Request, res: Response) {
    const menu: Record<string, MenuItem[]> = {};
    const rawMenu = await getRowMenu();
    
    for(const pair of rawMenu) {
        const category = pair.products.category ?? "sonstiges";
        const product = pair.products;
        const productVariant = pair.product_variants;

        if(!menu[category]) {
            menu[category] = [];
        } 

        const exists = menu[category].some(item => item.id === product.id);

        if(!exists) {
            menu[category].push({  
                "name": product.name, 
                "id": product.id, 
                ...(product.code && { "code": product.code }), 
                ...(product.category && { "category": product.category }), 
                ...(product.description && { "description": product.description }), 
                "variants": [] })
        }
        
        if(productVariant?.productId === product.id) {
            const index = menu[category].findIndex(
                item => item.id === productVariant.productId
            );
            menu[category][index].variants.push({ ...(productVariant.name && { "name": productVariant.name }), "price": productVariant.price }) 
        }

    }
    res.json(menu)
}
