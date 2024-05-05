import { Module } from "@nestjs/common";
import sqlProvider from "./pg.provider";
import { SqlService } from "./pg.service";
import { SqlController } from "./pg.controller";
import { MinioModule } from "src/minio/minio.module";

@Module({
    imports: [MinioModule],
    controllers: [SqlController],
    providers: [sqlProvider, SqlService],
    exports: [sqlProvider, SqlService],
})
export class PgModule {}
