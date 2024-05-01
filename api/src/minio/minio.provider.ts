import * as Minio from "minio";
import { config } from "dotenv";
import { MINIO_CONNECTION } from "src/constants";

config();

const minioProvider = {
    provide: MINIO_CONNECTION,
    useFactory: (): Minio.Client => {
        return new Minio.Client({
            endPoint: process.env.MINIO_ENDPOINT,
            port: Number(process.env.MINIO_PORT),
            useSSL: process.env.MINIO_USESSL === "true",
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY,
        });
    },
};

export default minioProvider;