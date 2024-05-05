import { CronExpression } from "@nestjs/schedule";

export class SetScheduleDto {
   readonly cronExpression: CronExpression;
};