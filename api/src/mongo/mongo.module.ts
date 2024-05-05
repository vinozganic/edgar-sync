import { Module } from "@nestjs/common";
import mongoProvider from "./mongo.provider";
import { MongoService } from "./mongo.service";
import { MongoController } from "./mongo.controller";
import { MinioModule } from "src/minio/minio.module";

@Module({
    imports: [MinioModule],
    controllers: [MongoController],
    providers: [mongoProvider, MongoService],
    exports: [mongoProvider],
})
export class MongoModule {}
