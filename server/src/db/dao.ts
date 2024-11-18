import { KxDocument } from "../models/model";
import { KxDocumentModel } from "../models/model";
import { mongoose } from "@typegoose/typegoose";
import dotenv from 'dotenv'; 


class DAO {
    private static instance: DAO;
    private constructor() {
        const str = process.env.MONGO_CONN_STR; 
        console.log('conn_string', str); 
        this.connectToDB(str);
    }

    static getInstance(): DAO {
        if (!DAO.instance) {
            
            DAO.instance = new DAO();
        }
        return DAO.instance;
    }

    private async connectToDB(conn_string: string | undefined ) {
        let conn :string = "mongodb://localhost:27017/kiruna-ex";
        if(conn_string) {
            conn = conn_string;
        }
        try {
            await mongoose.connect(conn, {
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

    async getKxDocumentById(id: mongoose.Types.ObjectId): Promise<KxDocument | null> {
        const result = await KxDocumentModel.find().where("_id").equals(id).exec();
        if (result) {
            return this.fromResultToKxDocument(result[0]);
        }
        return null;
    }
    async getKxDocumentByTitle(title: string): Promise<KxDocument | null> {
        const result = await KxDocumentModel.find().where("title").equals(title).exec();
        if (result) {
            return this.fromResultToKxDocument(result[0]);
        }
        return null;
    }
    async getAlldocuments(): Promise<KxDocument[]> {
    const result = await KxDocumentModel.find().sort({ title: 1 }).exec(); 
    if (result) {
        const list = result.map((doc: any) => {
            return this.fromResultToKxDocument(doc);
        });
        return list;
    }
    return [];
}
    async createKxDocument(document: KxDocument): Promise<KxDocument | null> {
        const newDocument = new KxDocumentModel(document);
        const result = await newDocument.save();
        if (result) {
            return this.fromResultToKxDocument(result);
        }
        return null;
    }
    async deleteKxDocument(id: mongoose.Types.ObjectId): Promise<Boolean> {
        const result = await KxDocumentModel.deleteOne({
            _id: id
        }).exec();
        if (result.deletedCount === 1) {
            return true;

        }
        return false;
    }
    private fromResultToKxDocument(result: any): KxDocument {
        return {
            title: result.title,
            _id: result._id,
            stakeholders: result.stakeholders,
            scale: result.scale,
            scale_info: result.scale_info,
            issuance_date: result.issuance_date,
            type: result.type,
            connections: result.connections,
            pages: result.pages,
            doc_coordinates: result.doc_coordinates,
            description: result.description,
            language: result.language,
        } as KxDocument;
    }
}



export const db = DAO.getInstance();

