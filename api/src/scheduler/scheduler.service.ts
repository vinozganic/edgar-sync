import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SqlService } from "src/pg/pg.service";

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(private readonly sqlService: SqlService) {}

    @Cron(CronExpression.EVERY_30_MINUTES)
    handleCronEverySecond() {
        // this.logger.debug("Called every 10 seconds");
        const res = this.sqlService.getStudentsTestResults(11810, 155);
        this.logger.log(`${res}`);
    }
}
