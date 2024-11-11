import { describe, test } from "@jest/globals"
import { db } from "../src/db/dao";
import { AreaType, KxDocumentType, Scale, Stakeholders } from "../src/models/enum";
import { Area, KxDocument, Point } from "../src/models/model";
import { mongoose } from "@typegoose/typegoose";
import { KIRUNA_COORDS } from "../src/utils";

const list: mongoose.Types.ObjectId[] = [];
const date = new Date();

beforeAll(async () => {
    const res = await db.createKxDocument({
        title: "title 1",
        stakeholders: [Stakeholders.RESIDENT],
        scale: 10,
        issuance_date: date,
        type: KxDocumentType.INFORMATIVE,
        language: "Swedish",
        doc_coordinates: { type: AreaType.ENTIRE_MUNICIPALITY },
        description: "Test",
        connections: {
            direct: [], collateral: [], projection: [], update: []
        },
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
            issuance_date: date,
            type: KxDocumentType.INFORMATIVE,
            language: "Swedish",
            doc_coordinates: {type: AreaType.ENTIRE_MUNICIPALITY},
            description: "Test",
            connections: {
                direct: [], collateral: [], projection: [], update: []
            },
        })
        if (res && res._id) {
            list.push(res._id);
        }
        expect(res).toHaveProperty("_id");
    });

    test("Test Get Document By Title", async () => {
        const res = await db.getKxDocumentByTitle("title 1");
        expect(res).toMatchObject<KxDocument>({
            title: "title 1",
            _id: list[0],
            stakeholders: [Stakeholders.RESIDENT],
            scale: 10,
            pages: [],
            issuance_date: date,
            type: KxDocumentType.INFORMATIVE,
            language: "Swedish",
            doc_coordinates: {type: AreaType.ENTIRE_MUNICIPALITY},
            description: "Test",
            connections: {
                direct: [], collateral: [], projection: [], update: []
            },
        })
    });
    test("Test Get All Documents", async () => {
        const res = await db.getAlldocuments();
        expect(res).toHaveLength(2);
    });

    test("Test Get Document By Id", async () => {
        const res = await db.getKxDocumentById(list[0]);
        expect(res).toMatchObject({
            title: "title 1",
            _id: list[0],
            stakeholders: [Stakeholders.RESIDENT],
            pages: [],
            scale: 10,
            issuance_date: date,
            type: KxDocumentType.INFORMATIVE,
            language: "Swedish",
            doc_coordinates: {type: AreaType.ENTIRE_MUNICIPALITY},
            description: "Test"
        })
    });
    test("Test Delete Document", async () => {
        const res = await db.deleteKxDocument(list[0]);
        const res2 = await db.deleteKxDocument(list[1]);
        expect(res).toBeTruthy();
        expect(res2).toBeTruthy();
    });
    test("Test complex pages query", async () => {
        const res = await db.createKxDocument({
            title: "test",
            stakeholders: [],
            scale: 0,
            issuance_date: date,
            type: KxDocumentType.INFORMATIVE,
            language: "Italian",
            doc_coordinates: {type: AreaType.ENTIRE_MUNICIPALITY},
            description: "Test",
            pages: [2, [4, 8]],
            connections: {
                direct: [], collateral: [], projection: [], update: []
            },
        });
        if (res && res._id) {
            expect(res).toHaveProperty("_id");
            const get = await db.getKxDocumentById(res._id);
            expect(get?.pages).toEqual([2, [4, 8]]);
            const res2 = await db.deleteKxDocument(res._id);
            expect(res2).toBeTruthy();
        }
    });

    test("Test query with whole municipality coordinates", async () => {
        const res = await db.createKxDocument({
            title: "test",
            stakeholders: [],
            scale: 0,
            issuance_date: date,
            type: KxDocumentType.INFORMATIVE,
            language: "Italian",
            doc_coordinates: {
                type: AreaType.ENTIRE_MUNICIPALITY,
            },
            description: "Test",
            connections: {
                direct: [], collateral: [], projection: [], update: []
            },
        });
        if (res && res._id) {
            expect(res).toHaveProperty("_id");
            const get = await db.getKxDocumentById(res._id);
            expect(get?.doc_coordinates).toMatchObject({type: AreaType.ENTIRE_MUNICIPALITY});
            const res2 = await db.deleteKxDocument(res._id);
            expect(res2).toBeTruthy();
        }
    });

    test("Test query with Point coordinates", async () => {
        const res = await db.createKxDocument({
            title: "test",
            stakeholders: [],
            scale: 0,
            issuance_date: date,
            type: KxDocumentType.INFORMATIVE,
            language: "Italian",
            doc_coordinates: {
                type: AreaType.POINT,
                coordinates: [20.26, 67.845]
            } as Point,
            description: "Test",
            connections: {
                direct: [], collateral: [], projection: [], update: []
            },
        });
        if (res && res._id) {
            expect(res).toHaveProperty("_id");
            const get = await db.getKxDocumentById(res._id);
            expect(get?.doc_coordinates).toMatchObject({type: AreaType.POINT, coordinates: [20.26, 67.845]});
            const res2 = await db.deleteKxDocument(res._id);
            expect(res2).toBeTruthy();
        }
    });

    test("Test query with Area (Polygons)", async () => {
        const res = await db.createKxDocument({
            title: "test",
            stakeholders: [],
            scale: 0,
            issuance_date: date,
            type: KxDocumentType.INFORMATIVE,
            language: "Italian",
            doc_coordinates: { type: AreaType.AREA, coordinates: [[KIRUNA_COORDS, KIRUNA_COORDS.map(c => c + 0.5), KIRUNA_COORDS.map(c => c - 0.5)]] } as Area,
            description: "Test",
            connections: {
                direct: [], collateral: [], projection: [], update: []
            },
        });
        if (res && res._id) {
            expect(res).toHaveProperty("_id");
            const get = await db.getKxDocumentById(res._id);
            expect(get?.doc_coordinates).toMatchObject({ type: AreaType.AREA, coordinates: [[KIRUNA_COORDS, KIRUNA_COORDS.map(c => c + 0.5), KIRUNA_COORDS.map(c => c - 0.5)]] });
            const res2 = await db.deleteKxDocument(res._id);
            expect(res2).toBeTruthy();
        }
    });
});

afterAll(async () => {
    await db.disconnectFromDB();
});