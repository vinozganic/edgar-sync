import { Module } from "@nestjs/common";
import { PgModule } from "./pg/pg.module";
import { MongoModule } from "./mongo/mongo.module";
import { MinioModule } from "./minio/minio.module";
import { ScheduleModule } from "@nestjs/schedule";
import { PipelineModule } from "./pipeline/pipeline.module";
import { TestModule } from "./test/test.module";

@Module({
    imports: [PgModule, MongoModule, MinioModule, PipelineModule, ScheduleModule.forRoot(), TestModule],
})
export class AppModule {}
