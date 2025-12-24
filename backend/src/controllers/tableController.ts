import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authHandlers";
import { createTable, getAllTables } from "../lib/db/queries/tables";
import { getTableByID } from "../lib/db/queries/tables";

export async function createTables(req: AuthenticatedRequest, res: Response) {
    type parameter = {
        from: number,
        to: number
    } 
    
    if(req.user?.role !== "admin") return res.sendStatus(403);

    const parameter: parameter = req.body;

    for(let count = parameter.from;  count <= parameter.to; count++) {
        try {
            await createTable({ number: count });
        } catch (error) {
            console.error(`Table ${count} failed`, error);
        }

    }

    return res.status(201).json({ success: true });
}

export async function getTables(req: AuthenticatedRequest, res: Response) {
    let tables;
    try {
        tables = await getAllTables()
    } catch (error) {
        console.error("fetching Table failed")
    }
    
    res.json({ "tables": tables})
}

export async function getTable(req: AuthenticatedRequest, res: Response) {
    const tableID = req.params.id;
    const table = await getTableByID(tableID);
    if(!table) return res.sendStatus(404);

    res.json(table)
}