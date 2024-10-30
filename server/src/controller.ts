import { Request, Response } from 'express';
import { db } from './db/dao';
import { KxDocument } from './models/model';

export const createKxDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const document: KxDocument = req.body;
        const createdDocument = await db.createKxDocument(document);
        if (createdDocument) {
            res.status(201).json(createdDocument);
        } else {
            res.status(500).json({ message: 'Failed to create document' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}