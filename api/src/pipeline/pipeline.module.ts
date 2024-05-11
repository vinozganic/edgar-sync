import { Module } from "@nestjs/common";
import { PgModule } from "src/pg/pg.module";
import { PipelineService } from "./pipeline.service";
import { PipelineController } from "./pipeline.controller";

@Module({
    controllers: [PipelineController],
    imports: [PgModule],
    providers: [PipelineService],
})
export class PipelineModule {}
