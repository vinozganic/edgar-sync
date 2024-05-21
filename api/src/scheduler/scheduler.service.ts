import { Injectable, Logger } from "@nestjs/common";
import { CronJob } from "cron";
import { SchedulerRegistry } from "@nestjs/schedule";
import { PipelineService } from "../pipeline/pipeline.service";
import { SetPipelineDto } from "../pipeline/dto/set-pipeline.dto";

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        private schedulerRegistry: SchedulerRegistry,
        private pipelineService: PipelineService
    ) {}

    createCronJob(setPipelineDto: SetPipelineDto, cronExpression: string) {
        const job = new CronJob(cronExpression, async () => {
            this.logger.log("Executing pipeline steps");
            await this.pipelineService.executePipeline(setPipelineDto.steps);
        });

        const jobName = `job-${new Date().toISOString().replace(/:/g, "-").replace(/\..+/, "")}`;
        this.schedulerRegistry.addCronJob(jobName, job);
        job.start();

        this.logger.log(`Cron job ${jobName} added with schedule ${cronExpression}`);
        return { message: `Cron job ${jobName} added with schedule ${cronExpression}` };
    }
}
