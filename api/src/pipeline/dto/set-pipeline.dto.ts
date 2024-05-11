import { CronExpression } from "@nestjs/schedule";

export class SetPipelineDto {
    readonly cronExpression: CronExpression;
}
