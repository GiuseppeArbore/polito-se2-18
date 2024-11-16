import { S3Client, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mongoose } from "@typegoose/typegoose";

export const BUCKET_NAME = "kiruna-explorer";
const ACCESS_KEY_ID = "003e50ef84b3a8e0000000003";
const SECRET_ACCESS_KEY = "K003G81SMlivjM8aOc02xythLIbhHFc";

export const kxObjectStorageClient = new S3Client({
    endpoint: "https://s3.eu-central-003.backblazeb2.com",
    region: "eu-central-003",
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    }
});

export namespace KxObjectStorageCommands {
    export function listAllObjects() {
        return new ListObjectsCommand({ Bucket: BUCKET_NAME });
    }

    export function listObjectsForDocument(docId: mongoose.Types.ObjectId) {
        return new ListObjectsCommand({ Bucket: BUCKET_NAME, Prefix: `${docId.toString()}/` });
    }
}

export async function getPresignedUrl(docId: mongoose.Types.ObjectId, fileName: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: `${docId.toString()}/${fileName}` })
    return getSignedUrl(kxObjectStorageClient, command, { expiresIn: 120 });
}