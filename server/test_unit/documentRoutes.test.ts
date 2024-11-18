import request from 'supertest';
import { Request, Response } from 'express';
import { createKxDocument } from '../src/controller';
import {app} from "../index";
import { db } from '../src/db/dao'
import { AreaType, KxDocumentType, Scale, Stakeholders } from '../src/models/enum';
import { KIRUNA_COORDS } from '../src/utils';
import { connections } from 'mongoose';
import {get} from 'http';


jest.mock('../src/controller');

afterAll(async () => {
    await db.disconnectFromDB();
});

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
            language: 'Swedish',
            doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
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
                language: 'Swedish',
                doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
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
                language: 'Swedish',
                doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
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
                language: 'Swedish',
                doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
                description: 'This is a test document for unit testing.',
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Title is required');
        expect(response.body.errors[1].msg).toBe('Stakeholders are required');
    });

    test('Test 4 - POST /api/documents - should return error 400 (coordinates too far)', async () => {

        const response = await request(app)
            .post('/api/documents')
            .send({
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: new Date().toISOString(),
                type: KxDocumentType.INFORMATIVE,
                language: 'Swedish',
                doc_coordinates: { type: AreaType.POINT, coordinates: [0, 0] },
                description: 'This is a test document for unit testing.',
            });

        expect(response.status).toBe(400);
    });

    test('Test 5 - POST /api/documents - should return error 400 (polygon partially outside of range)', async () => {

        const response = await request(app)
            .post('/api/documents')
            .send({
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: new Date().toISOString(),
                type: KxDocumentType.INFORMATIVE,
                language: 'Swedish',
                doc_coordinates: { type: AreaType.AREA, coordinates: [[KIRUNA_COORDS, [0, 0], [0, 0]]] },
                description: 'This is a test document for unit testing.',
            });

        expect(response.status).toBe(400);
    });

    test('Test 6 - POST /api/documents - should return error 400 (connection validation)', async () => {
        const response = await request(app)
            .post('/api/documents')
            .send({
                title: 'Unit Test Document',
                stakeholders: [Stakeholders.RESIDENT],
                scale_info: Scale.TEXT,
                scale: 10,
                issuance_date: new Date().toISOString(),
                type: KxDocumentType.INFORMATIVE,
                language: 'Swedish',
                doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
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

    

});