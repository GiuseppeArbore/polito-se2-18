import * as ClientS3 from "@aws-sdk/client-s3";
import * as ReqDes from "@aws-sdk/s3-request-presigner"
import { getPresignedUrl, KxObjectStorageCommands, BUCKET_NAME, kxObjectStorageClient } from "../src/object_storage/bucket";
import * as fs from "fs"
import mongoose from "mongoose";

const TEST_ID = "6738b18f8da44b335177509e";
const TEST_FILENAME = "filename";

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner");
jest.mock("fs", () => ({
    ...jest.requireActual("fs"),
    createReadStream: jest.fn()
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Object storage tests", () => {
    test("Test 1 - Correct listObjectsForDocument command generation", () => {
        KxObjectStorageCommands.listObjectsForDocument(new mongoose.Types.ObjectId(TEST_ID));
        expect(ClientS3.ListObjectsCommand).toHaveBeenCalledWith({ Bucket: BUCKET_NAME, Prefix: `${TEST_ID}/` });
    });

    test("Test 2 - Correct presigned URL generation", () => {
        getPresignedUrl(new mongoose.Types.ObjectId(TEST_ID), TEST_FILENAME);
        expect(ClientS3.GetObjectCommand).toHaveBeenCalledWith({ Bucket: BUCKET_NAME, Key: `${TEST_ID}/${TEST_FILENAME}` });
        expect(ReqDes.getSignedUrl).toHaveBeenCalledWith(kxObjectStorageClient, expect.anything(), { expiresIn: 120 });
    });

    test("Test 3 - Correct uploadAttachmentForDocument command generation", () => {
        jest.spyOn(fs, "createReadStream");
        KxObjectStorageCommands.uploadAttachmentForDocument(new mongoose.Types.ObjectId(TEST_ID), TEST_FILENAME);
        expect(ClientS3.PutObjectCommand).toHaveBeenCalledWith({
            Bucket: BUCKET_NAME,
            Key: `${TEST_ID}/${TEST_FILENAME}`,
            //Body: expect.anything()
        });
        expect(fs.createReadStream).toHaveBeenCalledTimes(1);
    });

    test("Test 4 - Correct deleteAttachmentForDocument command generation", () => {
        KxObjectStorageCommands.deleteAttachmentForDocument(new mongoose.Types.ObjectId(TEST_ID), TEST_FILENAME);
        expect(ClientS3.DeleteObjectCommand).toHaveBeenCalledWith({
            Bucket: BUCKET_NAME,
            Key: `${TEST_ID}/${TEST_FILENAME}`,
        });
    });
})