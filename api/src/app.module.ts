import { Module } from "@nestjs/common";
import { PgModule } from "./pg/pg.module";
import { MongoModule } from "./mongo/mongo.module";
import { MinioModule } from "./minio/minio.module";
import { ScheduleModule } from "@nestjs/schedule";
import { PipelineModule } from "./pipeline/pipeline.module";
import { SchedulerModule } from "./scheduler/scheduler.module";

@Module({
    imports: [PgModule, MongoModule, MinioModule, PipelineModule, ScheduleModule.forRoot(), SchedulerModule],
})
export class AppModule {}
