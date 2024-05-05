import { Module } from "@nestjs/common";
import { PgModule } from "src/pg/pg.module";
import { SchedulerService } from "./scheduler.service";
import { ScheduleController } from "./scheduler.controller";

@Module({
    controllers: [ScheduleController],
    imports: [PgModule],
    providers: [SchedulerService],
})
export class SchedulerModule {}
