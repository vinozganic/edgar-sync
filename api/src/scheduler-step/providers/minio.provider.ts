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

    async uploadBuffer(objectName: string, buffer: Buffer, contentType: string) {
        const metaData = {
            "Content-Type": contentType,
        };

        return new Promise((resolve, reject) => {
            this.minioClient.putObject(this.bucketName, objectName, buffer, buffer.length, metaData, (err, etag) => {
                if (err) reject(err);
                resolve(etag);
            });
        });
    }

    // readFile returns a stream of the file
    // async readFile(objectName: string): Promise<Stream> {
    //     return new Promise((resolve, reject) => {
    //         this.minioClient.getObject(this.bucketName, objectName, (err, dataStream) => {
    //             if (err) reject(err);
    //             resolve(dataStream);
    //         });
    //     });
    // }

    async readFile(objectName: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.minioClient.getObject(this.bucketName, objectName, (err, dataStream) => {
                if (err) reject(err);

                const chunks = [];
                dataStream.on("data", chunk => chunks.push(chunk));
                dataStream.on("error", reject);
                dataStream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
            });
        });
    }
}
