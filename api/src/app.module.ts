import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { PipelineModule } from "./pipeline/pipeline.module";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { MongoModule } from "./mongo/mongo.module";

@Module({
    imports: [PipelineModule, ScheduleModule.forRoot(), SchedulerModule, MongoModule],
})
export class AppModule {}
