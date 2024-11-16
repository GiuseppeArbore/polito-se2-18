import * as ClientS3 from "@aws-sdk/client-s3";
import { KxObjectStorageCommands, BUCKET_NAME } from "../src/object_storage/bucket";
import mongoose from "mongoose";

const TEST_ID = "6738b18f8da44b335177509e";

jest.mock("@aws-sdk/client-s3");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Object storage tests", () => {
    test("Test 1 - Correct listObjectsForDocument command generation", () => {
        KxObjectStorageCommands.listObjectsForDocument(new mongoose.Types.ObjectId(TEST_ID));
        expect(ClientS3.ListObjectsCommand).toHaveBeenCalledWith({ Bucket: BUCKET_NAME, Prefix: `${TEST_ID}/` });
    });
})