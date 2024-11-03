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
            return this.fromResultToKxDocument(result[0]);
        }
        return null;
    }
    async getKxDocumentByTitle(title: string): Promise<KxDocument | null> {
        const result = await Document.find().where("title").equals(title).exec();
        if (result) {
            return this.fromResultToKxDocument(result[0]);
        }
        return null;
    }
    async getAlldocuments(): Promise<KxDocument[]> {
        const result = await Document.find().exec();
        if (result) {
            const list = result.map((doc: any) => {
                return this.fromResultToKxDocument(doc);
            });
            return list;
        }
        return [];
    }
    async createKxDocument(document: KxDocument): Promise<KxDocument | null> {
        const newDocument = new Document(document);
        const result = await newDocument.save();
        if (result) {
            return this.fromResultToKxDocument(result);
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
    private fromResultToKxDocument(result: any): KxDocument {
        if (result.pages) {
            return {
                title: result.title,
                _id: result._id,
                stakeholders: result.stakeholders,
                scale: result.scale,
                scale_info: result.scale_info,
                issuance_date: result.issuance_date,
                type: result.type,
                connections: result.connections,
                connections_number: result.connections_number,
                pages: result.pages,
                area_type: result.area_type,
                description: result.description,
                language: result.language,
            } as KxDocument;
        }
        return {
            title: result.title,
            _id: result._id,
            stakeholders: result.stakeholders,
            scale: result.scale,
            scale_info: result.scale_info,
            issuance_date: result.issuance_date,
            type: result.type,
            connections_number: result.connections_number,
            connections: result.connections,
            area_type: result.area_type,
            description: result.description,
            language: result.language,
        } as KxDocument;
    }
}



export const db = DAO.getInstance();

