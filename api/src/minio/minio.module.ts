import { Module } from "@nestjs/common";
import { MinioService } from "./minio.service";
import minioProvider from "./minio.provider";

@Module({
    providers: [minioProvider],
    exports: [minioProvider],
})
export class MinioModule {}
