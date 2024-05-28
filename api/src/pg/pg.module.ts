import { Module } from "@nestjs/common";
import { edgarDbProvider, edgarSyncDbProvider } from "./pg.provider";

@Module({
    providers: [edgarDbProvider, edgarSyncDbProvider],
    exports: [edgarDbProvider, edgarSyncDbProvider],
})
export class PgModule {}
