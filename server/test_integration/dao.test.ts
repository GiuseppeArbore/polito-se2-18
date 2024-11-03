import { describe, test } from "@jest/globals"
import { db } from "../src/db/dao";
import { AreaType, KxDocumentType, Scale, Stakeholders } from "../src/models/enum";
import { KxDocument } from "../src/models/model";
import { ObjectId } from "mongoose";

const list: ObjectId[] = [];
const date = new Date();

beforeAll(async () => {
    const res = await db.createKxDocument({
        title: "title 1",
        stakeholders: [Stakeholders.RESIDENT],
        scale_info: Scale.TEXT,
        scale: 10,
        issuance_date: date,
        type: KxDocumentType.INFORMATIVE,
        connections: 0,
        language: "Swedish",
        doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
        description: "Test"
    } as KxDocument);
    if (res && res._id) {
        list.push(res._id);
    }
});

describe("Test DAO", () => {
    test("Test Create Document", async () => {
        const res = await db.createKxDocument({
            title: "title 2",
            stakeholders: [Stakeholders.RESIDENT],
            scale: 10,
            scale_info: Scale.TEXT,
            issuance_date: date,
            type: KxDocumentType.INFORMATIVE,
            connections: 0,
            language: "Swedish",
            doc_coordinates: {type: AreaType.ENTIRE_MUNICIPALITY},
            description: "Test",
        })
        if (res && res._id) {
            list.push(res._id);
        }
        expect(res).toHaveProperty("_id");
    });

    test("Test Get Document By Title", async () => {
        const res = await db.getKxDocumentByTitle("title 1");
        expect(res).toEqual({
            title: "title 1",
            _id: list[0],
            stakeholders: [Stakeholders.RESIDENT],
            scale: 10,
            pages: [],
            scale_info: Scale.TEXT,
            issuance_date: date,
            type: KxDocumentType.INFORMATIVE,
            connections: 0,
            language: "Swedish",
            doc_coordinates: {type: AreaType.ENTIRE_MUNICIPALITY},
            description: "Test"
        })
    });
    test("Test Get All Documents", async () => {
        const res = await db.getAlldocuments();
        expect(res).toHaveLength(2);
    });

    test("Test Get Document By Id", async () => {
        const res = await db.getKxDocumentById(list[0].toString());
        expect(res).toEqual({
            title: "title 1",
            _id: list[0],
            stakeholders: [Stakeholders.RESIDENT],
            pages: [],
            scale: 10,
            scale_info: Scale.TEXT,
            issuance_date: date,
            type: KxDocumentType.INFORMATIVE,
            connections: 0,
            language: "Swedish",
            doc_coordinates: {type: AreaType.ENTIRE_MUNICIPALITY},
            description: "Test"
        })
    });
    test("Test Delete Document", async () => {
        const res = await db.deleteKxDocument(list[0].toString());
        const res2 = await db.deleteKxDocument(list[1].toString());
        expect(res).toBeTruthy();
        expect(res2).toBeTruthy();
    });
    test("Test complex pages query", async () => {
        const res = await db.createKxDocument({
            title: "test",
            stakeholders: [],
            scale_info: Scale.TEXT,
            scale: 0,
            issuance_date: date,
            type: KxDocumentType.INFORMATIVE,
            connections: 0,
            language: "Italian",
            doc_coordinates: {type: AreaType.ENTIRE_MUNICIPALITY},
            description: "Test",
            pages: [2, [4, 8]]
        });
        if (res && res._id) {
            expect(res).toHaveProperty("_id");
            const get = await db.getKxDocumentById(res._id.toString());
            expect(get?.pages).toEqual([2, [4, 8]]);
            const res2 = await db.deleteKxDocument(res._id.toString());
            expect(res2).toBeTruthy();
        }
    });
});

afterAll(async () => {
    await db.disconnectFromDB();
});