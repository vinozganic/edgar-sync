import { Module } from "@nestjs/common";
import sqlProvider from "./pg.provider";

@Module({
    providers: [sqlProvider],
    exports: [sqlProvider],
})
export class PgModule {}
