import { Module } from "@nestjs/common";
import { PgModule } from "./pg/pg.module";
import { SqlController } from "./pg/pg.controller";
import { SqlService } from "./pg/pg.service";
import { MinioService } from "./minio/minio.service";
import { MongoModule } from "./mongo/mongo.module";
import { MongoService } from "./mongo/mongo.service";
import { MongoController } from "./mongo/mongo.controller";
import { MinioModule } from "./minio/minio.module";
import { ScheduleModule } from "@nestjs/schedule";
import { TasksService } from "./schedule/schedule.service";


@Module({
    imports: [PgModule, MongoModule, MinioModule, ScheduleModule.forRoot()],
    controllers: [SqlController, MongoController],
    providers: [SqlService, MongoService, MinioService, TasksService],
})
export class AppModule {}
