import { Controller, Post, Body } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";
import { CreateScheduledJobDto } from "./dto/create-scheduled-job.dto";

@Controller("scheduler")
export class SchedulerController {
    constructor(private readonly schedulerService: SchedulerService) {}

    @Post()
    async createScheduledJob(@Body() createScheduledJobDto: CreateScheduledJobDto) {
        const { steps, cronJob: cronExpression } = createScheduledJobDto;
        const setPipelineDto = { steps };

        return this.schedulerService.createCronJob(setPipelineDto, cronExpression);
    }
}
