import * as Minio from "minio";
import { config } from "dotenv";

config();

const minioClient: Minio.Client = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: Number(process.env.MINIO_PORT),
    useSSL: process.env.MINIO_USESSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});

export class MinioProvider {
    private minioClient: Minio.Client;
    private bucketName: string;

    constructor(bucketName: string) {
        this.minioClient = minioClient;
        this.bucketName = bucketName;
    }

    async uploadBuffer(objectName: string, buffer: Buffer, contentType: string): Promise<void> {
        const metaData = {
            "Content-Type": contentType,
        };

        return new Promise((resolve, reject) => {
            this.minioClient.putObject(this.bucketName, objectName, buffer, buffer.length, metaData, (err, etag) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    async readBuffer(objectName: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.minioClient.getObject(this.bucketName, objectName, (err, dataStream) => {
                if (err) return reject(err);

                const chunks: Buffer[] = [];
                dataStream.on("data", chunk => chunks.push(chunk));
                dataStream.on("error", reject);
                dataStream.on("end", () => resolve(Buffer.concat(chunks)));
            });
        });
    }

    async readFile(objectName: string): Promise<string> {
        return this.readBuffer(objectName)
            .then(buffer => buffer.toString("utf8"))
            .catch(err => {
                return Promise.reject(err);
            });
    }

    async listFiles(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const fileNames: string[] = [];

            const stream = this.minioClient.listObjectsV2(this.bucketName, "", true);
            stream.on("data", obj => {
                if (obj.name) fileNames.push(obj.name);
            });
            stream.on("error", reject);
            stream.on("end", () => resolve(fileNames));
        });
    }

    async createFolderWithSubfolders(bucketName: string, folderName: string): Promise<void> {
        const subfolders = ["scripts/", "db-recordsets/", "results/"];

        for (const subfolder of subfolders) {
            const fullFolderName = `${folderName}/${subfolder}`;
            await new Promise<void>((resolve, reject) => {
                this.minioClient.putObject(bucketName, fullFolderName, "", err => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }
    }
}
