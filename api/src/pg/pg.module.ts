import { Module } from "@nestjs/common";
import { edgarDbProvider, edgarSyncDbProvider } from "./pg.provider";
import { SqlService } from "./pg.service";
import { SqlController } from "./pg.controller";
import { MinioModule } from "src/minio/minio.module";

@Module({
    imports: [MinioModule],
    controllers: [SqlController],
    providers: [edgarDbProvider, edgarSyncDbProvider, SqlService],
    exports: [edgarDbProvider, edgarSyncDbProvider, SqlService],
})
export class PgModule {}
