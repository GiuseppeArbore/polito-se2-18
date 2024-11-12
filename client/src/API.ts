import { mongoose } from '@typegoose/typegoose';
import { KxDocument } from './model';

const API_URL = 'http://localhost:3001/api';

 const createKxDocument = async (document: KxDocument): Promise<KxDocument | null> => {
    try {
        const response = await fetch(API_URL + "/documents", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(document),
        });
    
        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }
    
        const data: KxDocument = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to create document: ${error.message}`);
        } else {
            throw new Error('Failed to create document: Unknown error');
        }
    }
};
const getAllKxDocuments = async (): Promise<KxDocument[]> => {
    try {
        const response = await fetch(API_URL + "/documents", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }

        const data: KxDocument[] = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch documents: ${error.message}`);
        } else {
            throw new Error('Failed to fetch documents: Unknown error');
        }
    }
};

const deleteKxDocument = async (id: mongoose.Types.ObjectId): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/documents/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete document: ${error.message}`);
        } else {
            throw new Error('Failed to delete document: Unknown error');
        }
    }
};

const API = { createKxDocument, getAllKxDocuments, deleteKxDocument };
export default API;