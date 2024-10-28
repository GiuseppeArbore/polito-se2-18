import { KxDocument } from "../models/model";
import { Document } from "./schema";
import mongoose from 'mongoose';


class DAO {
    private static instance: DAO;
    private constructor() {
        this.connectToDB();
    }
    
    static getInstance(): DAO {
        if (!DAO.instance) {
            DAO.instance = new DAO();
        }
        return DAO.instance;
    }

    private async connectToDB() {
        try {
            await mongoose.connect('mongodb://localhost:27017/kiruna-ex', {
                autoCreate: true,
            });
            console.log('Connected to the database');
        } catch (error) {
            console.error('Error connecting to the database', error);
        }
    }
    async disconnectFromDB() {
        try {
            await mongoose.disconnect();
        } catch (error) {
            console.error('Error disconnecting from the database', error);
        }
    }
    Document = require('../models/model');

    async getKxDocumentById(id: string): Promise<KxDocument | null> {
        const result = await Document.find().where("_id").equals(id).exec();
        if (result) {
            const doc:KxDocument = {
                title: result[0].title,
                _id: result[0]._id,
                stakeholders: result[0].stakeholders,
                scale: result[0].scale,
                issuance_date: result[0].issuance_date,
                type: result[0].type,
                connections: result[0].connections,
                language: result[0].language,
                area_type: result[0].area_type,
                description: result[0].description,
            };
            return doc;
        }
        return null;
    }
    async getKxDocumentByTitle(title: string): Promise<KxDocument | null> {
        const result = await Document.find().where("title").equals(title).exec();
        if (result) {
            const doc:KxDocument = {
                title: result[0].title,
                _id: result[0]._id,
                stakeholders: result[0].stakeholders,
                scale: result[0].scale,
                issuance_date: result[0].issuance_date,
                type: result[0].type,
                connections: result[0].connections,
                language: result[0].language,
                area_type: result[0].area_type,
                description: result[0].description,
            };
            return doc;
        }
        return null;
    }
    async getAlldocuments(): Promise<KxDocument[]> {
        const result = await Document.find().exec();
        if (result) {
            const list = result.map((doc: any) => {
                return {
                    title: doc.title,
                    _id: doc._id,
                    stakeholders: doc.stakeholders,
                    scale: doc.scale,
                    issuance_date: doc.issuance_date,
                    type: doc.type,
                    connections: doc.connections,
                    language: doc.language,
                    area_type: doc.area_type,
                    description: doc.description,
            } as KxDocument;}); 
            return list;
        }
        return [];
    }
    async createKxDocument(document: KxDocument): Promise<KxDocument | null> {
        const newDocument = new Document(document);
        const result = await newDocument.save();
        if (result) {
            return {
                title: result.title,
                _id: result._id,
                stakeholders: result.stakeholders,
                scale: result.scale,
                issuance_date: result.issuance_date,
                type: result.type,
                connections: result.connections,
                language: result.language,
                area_type: result.area_type,
                description: result.description,
        } as KxDocument;
        }
        return null;
    }
    async deleteKxDocument(id: string): Promise<Boolean> {
        const result = await Document.deleteOne({
            _id: id
        }).exec();
        if (result) {
            return true;
           
        }
        return false;
    }
}


export const db = DAO.getInstance();

