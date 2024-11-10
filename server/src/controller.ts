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
        res.status(200).json(documents);
    } catch (error) {
        next(error);
    }
};

export const deleteKxDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id;
        const isDeleted = await db.deleteKxDocument(id);
        if (isDeleted) {
            res.status(204).send();
        } else {
            res.status(404).json("Document not found");
        }
    } catch (error) {
        next(error);
    }
}

