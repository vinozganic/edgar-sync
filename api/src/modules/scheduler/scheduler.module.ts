import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerController } from "./scheduler.controller";
import { PipelineService } from "src/modules/pipeline/pipeline.service";
import { SchedulerService } from "./scheduler.service";
import { PipelineModule } from "src/modules/pipeline/pipeline.module";
import { edgarDbProvider, edgarSyncDbProvider } from "src/modules/pg/pg.provider";

@Module({
    imports: [ScheduleModule.forRoot(), PipelineModule],
    controllers: [SchedulerController],
    providers: [SchedulerService, PipelineService, edgarDbProvider, edgarSyncDbProvider],
})
export class SchedulerModule {}
