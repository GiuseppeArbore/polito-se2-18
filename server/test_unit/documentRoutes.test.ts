import request from 'supertest';
import { Request, Response } from 'express';
import { createKxDocument } from '../src/controller';
import {app} from "../index";
import { AreaType, KxDocumentType, Scale, Stakeholders } from '../src/models/enum';
import { connections } from 'mongoose';


jest.mock('../src/controller', () => ({
    createKxDocument: jest.fn(),
}));


describe('Document Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Test 1 - POST /api/documents - should create a new document', async () => {
        const mockDocument = {
            _id: '12345',
            title: 'Unit Test Document',
            stakeholders: [Stakeholders.RESIDENT],
            scale_info: Scale.TEXT,
            scale: 10,
            issuance_date: new Date().toISOString(),
            type: KxDocumentType.INFORMATIVE,
            connections_number: 4,
            language: 'Swedish',
            area_type: AreaType.ENTIRE_MUNICIPALITY,
            description: 'This is a test document for unit testing.',
            pages: [],
            connections: {
                direct: ['1'],
                collateral: ['2'],
                projection: ['3'],
                update: ['4']
            }
        };

        (createKxDocument as jest.Mock).mockImplementation((req: Request, res: Response) => {
            res.status(201).json(mockDocument);
        });

        const response = await request(app)
            .post('/api/documents')
            .send({
                title: 'Unit Test Document',
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: new Date().toISOString(),
                type: KxDocumentType.INFORMATIVE,
                connections_number: 4,
                language: 'Swedish',
                area_type: AreaType.ENTIRE_MUNICIPALITY,
                description: 'This is a test document for unit testing.',
                pages: [],
                connections: {
                    direct: ['1'],
                    collateral: ['2'],
                    projection: ['3'],
                    update: ['4']
                }
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id', '12345');
        expect(response.body.title).toBe('Unit Test Document');
    });

   

    test('Test 2 - POST /api/documents - should return error 400 (missing title)', async () => {


        const response = await request(app)
            .post('/api/documents')
            .send({
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: new Date().toISOString(),
                type: KxDocumentType.INFORMATIVE,
                connections_number: 0,
                language: 'Swedish',
                area_type: AreaType.ENTIRE_MUNICIPALITY,
                description: 'This is a test document unit testing.',

            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Title is required');
    });

    test('Test 3 - POST /api/documents - should return error 400 (missing title,stakeholders)', async () => {

        const response = await request(app)
            .post('/api/documents')
            .send({
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: new Date().toISOString(),
                type: KxDocumentType.INFORMATIVE,
                connections_number: 0,
                language: 'Swedish',
                area_type: AreaType.ENTIRE_MUNICIPALITY,
                description: 'This is a test document for unit testing.',
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Title is required');
        expect(response.body.errors[1].msg).toBe('Stakeholders are required');
    });

    test('Test 4 - POST /api/documents - should return error 400 (connection validation)', async () => {
        const response = await request(app)
            .post('/api/documents')
            .send({
                title: 'Unit Test Document',
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: new Date().toISOString(),
                type: KxDocumentType.INFORMATIVE,
                connections_number: 5,
                language: 'Swedish',
                area_type: AreaType.ENTIRE_MUNICIPALITY,
                description: 'This is a test document unit testing.',
                connections: {
                    direct: ['1', '2'],
                    collateral: ['2'],
                    projection: ['3'],
                    update: ['4']
                }
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Invalid connections');}
    );

    test('Test 5 - POST /api/documents - should return error 400 (connection number invalid)', async () => {
        const response = await request(app)
            .post('/api/documents')
            .send({
                title: 'Unit Test Document',
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: new Date().toISOString(),
                type: KxDocumentType.INFORMATIVE,
                connections_number: 3,
                language: 'Swedish',
                area_type: AreaType.ENTIRE_MUNICIPALITY,
                description: 'This is a test document unit testing.',
                connections: {
                    direct: ['1'],
                    collateral: ['2'],
                    projection: ['3'],
                    update: ['4']
                }
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Connections number is not equal to the total number of connections');}
    );


    
});