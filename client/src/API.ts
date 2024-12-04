import { mongoose } from '@typegoose/typegoose';
import { KxDocument, KxDocumentAggregateData, PageRange } from './model';

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

// function to update title, stakeholders, type, scale, language, pages
const updateKxDocumentInformation = async (
    documentId: string,
    title?: string,
    stakeholders?: string[],
    type?: string,
    scale?: number,
    language?: string,
    pages?: PageRange[],
    doc_coordinates?: any
): Promise<KxDocument | null> => {
    try {
        const body: any = {};
        if (title !== undefined) body.title = title;
        if (stakeholders !== undefined) body.stakeholders = stakeholders;
        if (type !== undefined) body.type = type;
        if (scale !== undefined) body.scale = scale;
        if (language !== undefined) body.language = language;
        if (pages !== undefined) body.pages = pages;
        if (doc_coordinates !== undefined) body.doc_coordinates = doc_coordinates;

        const response = await fetch(API_URL + `/documents/${documentId}/info`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }

        const data: KxDocument = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to update document: ${error.message}`);
        } else {
            throw new Error('Failed to update document: Unknown error');
        }
    }
};

const updateKxDocumentDescription = async (documentId: string, description: string): Promise<KxDocument | null> => {
    try {
        const response = await fetch(API_URL + `/documents/${documentId}/description`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description }),
                  });

        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }

        const data: KxDocument = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to update document: ${error.message}`);
        } else {
            throw new Error('Failed to update document: Unknown error');
        }
    }
};
const getKxFileByID = async (id: mongoose.Types.ObjectId, fileName:string): Promise<{presignedUrl: string}> => {
    try {
        const response = await fetch(API_URL + `/documents/${id}/presignedUrl/${fileName}`, {
            method: 'GET',

        });

        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }
        const data: {presignedUrl: string} = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch document: ${error.message}`);
        } else {
            throw new Error('Failed to fetch document: Unknown error');
        }
    }
};

const getKxDocumentById = async (id: mongoose.Types.ObjectId): Promise<KxDocument> => {
    try {
        const response = await fetch(API_URL + `/documents/${id}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }

        const data: KxDocument = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch document: ${error.message}`);
        } else {
            throw new Error('Failed to fetch document: Unknown error');
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

const addAttachmentToDocument = async (id: mongoose.Types.ObjectId, files: File[]): Promise<Boolean> => {
    try {
        const formData = new FormData();
        files.forEach(file => formData.append('attachments', file, file.name));
        const response = await fetch(`${API_URL}/documents/${id}/attachments`, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }
        return true;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to add attachment: ${error.message}`);
        } else {
            throw new Error('Failed to add attachment: Unknown error');
        }
    }
};

const aggregateData = async (): Promise<KxDocumentAggregateData[]> => {
    try {
        const response = await fetch(API_URL + "/documents/aggregateData", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }

        const data: KxDocumentAggregateData[] = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch aggregateData: ${error.message}`);
        } else {
            throw new Error('Failed to fetch aggregateData: Unknown error');
        }
    }
};

const API = { createKxDocument, getAllKxDocuments, getKxDocumentById, deleteKxDocument, updateKxDocumentDescription, updateKxDocumentInformation, getKxFileByID, addAttachmentToDocument, aggregateData };
export default API;