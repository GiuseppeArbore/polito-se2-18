import { describe, test } from "@jest/globals"
import request from 'supertest';
import {app} from "../index";
import { AreaType, KxDocumentType, Scale, Stakeholders } from "../src/models/enum";
import {db} from "../src/db/dao";


const date = new Date();
let documentIds: string[] = [];

describe("Integration Tests for Document API", () => {
    
    afterAll(async () => {

        for (const id of documentIds) {
            await db.deleteKxDocument(id);
        }

        await db.disconnectFromDB();
    });

    test("Should create a new document", async () => {
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
                area_type: AreaType.ENTIRE_MUNICIPALITY,
                description: "This is a test document for integration testing."
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.title).toBe("Integration Test Document");

        documentIds.push(response.body._id);
    });

    test("Should fail to create a document with missing required fields", async () => {
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
                area_type: AreaType.ENTIRE_MUNICIPALITY,
                description: "This is a test document with missing title."
            });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].msg).toBe('Title is required');
    });

});

