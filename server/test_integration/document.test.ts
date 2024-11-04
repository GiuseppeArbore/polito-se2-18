import { describe, test } from "@jest/globals"
import request from 'supertest';
import {app} from "../index";
import { AreaType, KxDocumentType, Scale, Stakeholders } from "../src/models/enum";
import { KxDocument } from "../src/models/model";
import {db} from "../src/db/dao";
import { KIRUNA_COORDS } from "../src/utils";



const date = new Date();
let documentIds: string[] = [];

describe("Integration Tests for Document API", () => {
    
    afterAll(async () => {

        for (const id of documentIds) {
            await db.deleteKxDocument(id);
        }

        await db.disconnectFromDB();
    });

    test("Test 1 - Should create a new document", async () => {
        const response = await request(app)
            .post('/api/documents')
            .send({
                title: "Integration Test Document",
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: date,
                type: KxDocumentType.INFORMATIVE,
                connections: 0,
                language: "Swedish",
                doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
                description: "This is a test document for integration testing.",
                pages: []
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.title).toBe("Integration Test Document");

        documentIds.push(response.body._id);
    });

    test("Test 2 - Should fail to create a document with missing required fields (title)", async () => {
        const response = await request(app)
            .post('/api/documents')
            .send({
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: date,
                type: KxDocumentType.INFORMATIVE,
                connections: 0,
                language: "Swedish",
                doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
                description: "This is a test document with missing title."
            });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].msg).toBe('Title is required');
    });


    test("Test 3 - Should not create a new document if i send an already existing _id", async () => {
        const response = await request(app)
            .post('/api/documents')
            .send({
                _id: documentIds[0],
                title: "Integration Test Document",
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: date,
                type: KxDocumentType.INFORMATIVE,
                connections: 0,
                language: "Swedish",
                doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
                description: "This is a test document for integration testing.",
                pages: []
            });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Internal Server Error', status: 400 });
    });

    test("Test 4 - Should return 500 if there is a database error", async () => {
        
        const originalCreateKxDocument = db.createKxDocument;
        db.createKxDocument = async () => { 
            const error = new Error('Database error');
            (error as any).customCode = 500;
            throw error;
        };

        const response = await request(app)
            .post('/api/documents')
            .send({
                _id: documentIds[0],
                title: "Integration Test Document",
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: date,
                type: KxDocumentType.INFORMATIVE,
                connections: 0,
                language: "Swedish",
                doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
                description: "This is a test document for integration testing.",
                pages: []
            });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal Server Error', status: 500 });

        
        db.createKxDocument = originalCreateKxDocument;
    });


    test("Test 5 - Should fail to create a document with multiple missing required fields (title,stakeholders)", async () => {
        const response = await request(app)
            .post('/api/documents')
            .send({
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: date,
                type: KxDocumentType.INFORMATIVE,
                connections: 0,
                language: "Swedish",
                doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
                description: "This is a test document with missing title."
            });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].msg).toBe('Title is required');
        expect(response.body.errors[1].msg).toBe('Stakeholders are required');
    });

    test("Test 6 - Should fail to create a document (area outside of allowed radius)", async () => {
        const response = await request(app)
            .post('/api/documents')
            .send({
                title: "Integration Test Document",
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: date,
                type: KxDocumentType.INFORMATIVE,
                connections: 0,
                language: "Swedish",
                doc_coordinates: { type: AreaType.POINT, coordinates: [0, 0] },
                description: "This is a test document with missing title."
            });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].msg).toBe('Invalid document coordinates');
    });

    test("Test 7 - Should fail (area overlapping border)", async () => {
        const response = await request(app)
            .post('/api/documents')
            .send({
                title: "Integration Test Document",
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: date,
                type: KxDocumentType.INFORMATIVE,
                connections: 0,
                language: "Swedish",
                doc_coordinates: { type: AreaType.AREA, coordinates: [[KIRUNA_COORDS, [0, 0], [1, 1]]] },
                description: "This is a test document with missing title."
            });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].msg).toBe('Invalid document coordinates');
    });

    test("Test 8 - Should succeed", async () => {
        const response = await request(app)
            .post('/api/documents')
            .send({
                title: "Integration Test Document",
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: date,
                type: KxDocumentType.INFORMATIVE,
                connections: 0,
                language: "Swedish",
                doc_coordinates: { type: AreaType.AREA, coordinates: [[KIRUNA_COORDS, KIRUNA_COORDS.map(c => c + 0.5), KIRUNA_COORDS.map(c => c - 0.5)]] },
                description: "Test document"
            });
            documentIds.push(response.body._id);
            
        expect(response.status).toBe(201);
    });


    test("Test 9 - Should fetch multiple documents", async () => {
        
        const responsePost1 = await request(app)
            .post('/api/documents')
            .send({
                title: "Document 1",
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: date,
                type: KxDocumentType.INFORMATIVE,
                connections: 0,
                language: "Swedish",
                doc_coordinates: { type: AreaType.AREA, coordinates: [[KIRUNA_COORDS, KIRUNA_COORDS.map(c => c + 0.5), KIRUNA_COORDS.map(c => c - 0.5)]] },
                description: "Test document 1"
            });
            documentIds.push(responsePost1.body._id);
       const responsePost2 =  await request(app)
            .post('/api/documents')
            .send({
                title: "Document 2",
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: date,
                type: KxDocumentType.INFORMATIVE,
                connections: 0,
                language: "Swedish",
                doc_coordinates: { type: AreaType.AREA, coordinates: [[KIRUNA_COORDS, KIRUNA_COORDS.map(c => c + 0.5), KIRUNA_COORDS.map(c => c - 0.5)]] },
                description: "Test document 2"
            });
    
            documentIds.push(responsePost2.body._id);
        const response = await request(app).get('/api/documents');
    
        
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(2);
        expect(response.body.some((doc: KxDocument) => doc.title === "Document 1")).toBe(true);
        expect(response.body.some((doc: KxDocument) => doc.title === "Document 2")).toBe(true);
    });

    test("Test 10 - Insert 100 documents", async () => {
        
    
        
        for (let i = 0; i < 100; i++) {
            const response = await request(app)
                .post('/api/documents')
                .send({
                    title: `Document ${i + 1}`,
                    stakeholders: [Stakeholders.RESIDENT],
                    scale_info: Scale.TEXT,
                    scale: 10,
                    issuance_date: new Date(),
                    type: KxDocumentType.INFORMATIVE,
                    connections: 0,
                    language: "Swedish",
                    doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
                    description: `This is test document ${i + 1}.`,
                    pages: []
                });
            expect(response.status).toBe(201);
            //documentIds.push(response.body._id);
        }
    
        
       
    });

    test("Test 10 - Insert 1000 documents", async () => {
        
    
        
        for (let i = 0; i < 1000; i++) {
            const response = await request(app)
                .post('/api/documents')
                .send({
                    title: `Document ${i + 1}`,
                    stakeholders: [Stakeholders.RESIDENT],
                    scale_info: Scale.TEXT,
                    scale: 10,
                    issuance_date: new Date(),
                    type: KxDocumentType.INFORMATIVE,
                    connections: 0,
                    language: "Swedish",
                    doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
                    description: `This is test document ${i + 1}.`,
                    pages: []
                });
            expect(response.status).toBe(201);
            //documentIds.push(response.body._id);
        }
    
        
       
    },10000);
});

