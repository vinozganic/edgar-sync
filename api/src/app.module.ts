import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { PipelineModule } from "./modules/pipeline/pipeline.module";
import { MongoModule } from "./modules/mongo/mongo.module";
import { SchedulerModule } from "./modules/scheduler/scheduler.module";

@Module({
    imports: [PipelineModule, ScheduleModule.forRoot(), SchedulerModule, MongoModule],
})
export class AppModule {}
