import { Request, Response, NextFunction } from 'express';
import { db } from './db/dao';
import { KxDocument } from './models/model';

export const createKxDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const document: KxDocument = req.body;
        const createdDocument = await db.createKxDocument(document);
   
        if (createdDocument) {
            res.status(201).json(createdDocument);
        }

    } catch (error) {
        next(error); 
    }
};

export const getAllKxDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const documents: KxDocument[] = await db.getAlldocuments();
        const sortedDocuments = documents.sort((a, b) => a.title.localeCompare(b.title));
        res.status(200).json(sortedDocuments);
    } catch (error) {
        next(error);
    }
};

