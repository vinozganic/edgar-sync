import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerController } from "./scheduler.controller";
import { PipelineService } from "src/pipeline/pipeline.service";
import { SchedulerService } from "./scheduler.service";
import { PipelineModule } from "src/pipeline/pipeline.module";
import { edgarDbProvider, edgarSyncDbProvider } from "src/pg/pg.provider";


@Module({
    imports: [ScheduleModule.forRoot(), PipelineModule],
    controllers: [SchedulerController],
    providers: [SchedulerService, PipelineService, edgarDbProvider, edgarSyncDbProvider],
})
export class SchedulerModule {}
