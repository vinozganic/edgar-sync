import { Injectable, Inject } from "@nestjs/common";
import * as Minio from "minio";
import { MINIO_CONNECTION } from "src/constants";

@Injectable()
export class MinioService {
    constructor(@Inject(MINIO_CONNECTION) private minioClient: Minio.Client) {}

    async uploadBuffer(objectName: string, buffer: Buffer, contentType: string) {
        const metaData = {
            "Content-Type": contentType,
        };

        const bucketName = "edgar-bucket";

        return new Promise((resolve, reject) => {
            this.minioClient.putObject(
                bucketName,
                objectName,
                buffer,
                buffer.length,
                metaData,
                (err, etag) => {
                    if (err) reject(err);
                    resolve(etag);
                }
            );
        });
    }
}
