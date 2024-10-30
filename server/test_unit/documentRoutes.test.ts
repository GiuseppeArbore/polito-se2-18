import request from 'supertest';
import { Request, Response } from 'express';
import { createKxDocument } from '../src/controller';
import {app} from "../index";
import { AreaType, KxDocumentType, Scale, Stakeholders } from '../src/models/enum';

// Mock del controller
jest.mock('../src/controller', () => ({
    createKxDocument: jest.fn(),
}));


describe('Document Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /api/documents - should create a new document', async () => {
        const mockDocument = {
            _id: '12345',
            title: 'Integration Test Document',
            stakeholders: [Stakeholders.RESIDENT],
            scale_info: Scale.TEXT,
            scale: 10,
            issuance_date: new Date().toISOString(),
            type: KxDocumentType.INFORMATIVE,
            connections: 0,
            language: 'Swedish',
            area_type: AreaType.ENTIRE_MUNICIPALITY,
            description: 'This is a test document for integration testing.',
        };

        (createKxDocument as jest.Mock).mockImplementation((req: Request, res: Response) => {
            res.status(201).json(mockDocument);
        });

        const response = await request(app)
            .post('/api/documents')
            .send({
                title: 'Integration Test Document',
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: new Date().toISOString(),
                type: KxDocumentType.INFORMATIVE,
                connections: 0,
                language: 'Swedish',
                area_type: AreaType.ENTIRE_MUNICIPALITY,
                description: 'This is a test document for integration testing.',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id', '12345');
        expect(response.body.title).toBe('Integration Test Document');
    });

   

    test('POST /api/documents - should fail with missing required fields', async () => {
        const response = await request(app)
            .post('/api/documents')
            .send({
                stakeholders: ['RESIDENT'],
                scale_info: 'TEXT',
                scale: 10,
                issuance_date: new Date().toISOString(),
                type: 'INFORMATIVE',
                connections: 0,
                language: 'Swedish',
                area_type: 'ENTIRE_MUNICIPALITY',
                description: 'This is a test document for integration testing.',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});