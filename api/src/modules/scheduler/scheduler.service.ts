import { Inject, Injectable, Logger } from "@nestjs/common";
import { CronJob } from "cron";
import { SchedulerRegistry } from "@nestjs/schedule";
import { Kysely } from "kysely";
import { EdgarSyncDB } from "src/config/pg-types/edgar_sync_db";
import { config } from "dotenv";
import { PipelineService } from "../pipeline/pipeline.service";
import { PG_SYNC_CONNECTION } from "src/config/constants";
import { ScheduledJobDto } from "src/dtos/scheduled-job.dto";
import { CreateUpdateScheduledJobDto } from "src/dtos/create-update-scheduled-job.dto";
import { MinioProvider } from "src/pipeline-logic/pipeline-providers/minio.provider";

config();

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        @Inject(PG_SYNC_CONNECTION) private edgarSyncDb: Kysely<EdgarSyncDB>,
        private schedulerRegistry: SchedulerRegistry,
        private pipelineService: PipelineService
    ) {}

    async loadScheduledJobsOnStart() {
        const scheduledJobs = await this.getAllScheduledJobs();
        for (const job of scheduledJobs) {
            const cronJob = new CronJob(job.cronJob, async () => {
                this.logger.log(`Executing pipeline steps for job ${job.uuid}`);
                await this.pipelineService.executePipeline(job.steps, job.uuid);
            });
            this.schedulerRegistry.addCronJob(job.uuid, cronJob);
            cronJob.start();
            this.logger.log(`Cron job ${job.uuid} loaded with schedule ${job.cronJob}`);
        }
    }

    // On application startup, load all scheduled jobs
    async onModuleInit() {
        // await this.loadScheduledJobsOnStart(); // TODO: Uncomment this line
    }

    async createScheduledJob(createUpdateScheduledJobDto: CreateUpdateScheduledJobDto) {
        const { name, steps, cronJob: cronExpression } = createUpdateScheduledJobDto;

        // Insert the pipeline job into the database
        const scheduledJob = {
            name: name,
            steps: steps,
            cronjob: cronExpression,
        };
        const stepsJson = JSON.stringify(scheduledJob.steps);
        const createdJob = await this.edgarSyncDb
            .insertInto("scheduledJobs")
            .values({
                name: scheduledJob.name,
                steps: stepsJson,
                cronJob: scheduledJob.cronjob,
            })
            .returning("uuid")
            .execute();
        const createdJobUuid = createdJob[0].uuid;
        console.log(createdJobUuid);

        // Create a cron job
        const job = new CronJob(cronExpression, async () => {
            this.logger.log(`Executing pipeline steps for job '${name}' (${createdJobUuid})`);
            await this.pipelineService.executePipeline(steps, createdJobUuid);
        });
        this.schedulerRegistry.addCronJob(createdJobUuid, job);
        job.start();

        this.logger.log(`Cron job ${createdJobUuid} added with schedule ${cronExpression}`);
        return { message: `Cron job ${createdJobUuid} added with schedule ${cronExpression}` };
    }

    async getAllScheduledJobs() {
        const res = (await this.edgarSyncDb.selectFrom("scheduledJobs").selectAll().execute()) as ScheduledJobDto[];

        for (const job of res) {
            for (const step of job.steps) {
                if (step.name === "ExecuteRScript") {
                    const scriptName = step.args[0];
                    try {
                        const minioProvider = new MinioProvider("edgar-scripts");
                        const script = await minioProvider.readBuffer(scriptName);
                        const base64Script = script.toString("base64");
                        const extension = scriptName.split(".").pop();
                        step.script = {
                            base64: base64Script,
                            name: scriptName,
                            extension: extension,
                            type: extension.toLowerCase() === "r" ? "text/plain" : "text/markdown",
                        };
                    } catch (err) {
                        throw new Error(
                            `[MINIO ERROR]: Error reading script ${scriptName} from Minio: ${err.message} for job ${job.name} (${job.uuid})`
                        );
                    }
                }
            }
        }
        return res;
    }

    async deleteScheduledJob(uuid: string) {
        // Delete activated cron job
        this.schedulerRegistry.deleteCronJob(uuid);
        this.logger.log(`Cron job ${uuid} deleted`);

        // Delete scheduled job from database
        const res = (
            await this.edgarSyncDb
                .deleteFrom("scheduledJobs")
                .where("uuid", "=", uuid)
                .returning(["uuid", "name", "steps", "cronJob", "created", "lastModified"])
                .execute()
        )[0];
        return res as ScheduledJobDto;
    }

    async updateScheduledJob(uuid: string, createUpdateScheduledJobDto: CreateUpdateScheduledJobDto) {
        const { name, steps, cronJob: cronExpression } = createUpdateScheduledJobDto;

        // Delete existing cron job
        this.schedulerRegistry.deleteCronJob(uuid);
        this.logger.log(`Old cron job ${uuid} deleted`);

        // Update scheduled job in database
        const stepsJson = JSON.stringify(steps);
        const updatedJob = await this.edgarSyncDb
            .updateTable("scheduledJobs")
            .set({
                name: name,
                steps: stepsJson,
                cronJob: cronExpression,
            })
            .where("uuid", "=", uuid)
            .returning(["uuid", "name", "steps", "cronJob"])
            .execute();

        // Create new cron job
        const job = new CronJob(cronExpression, async () => {
            this.logger.log("Executing pipeline steps");
            await this.pipelineService.executePipeline(steps, uuid);
        });
        this.schedulerRegistry.addCronJob(uuid, job);
        job.start();

        this.logger.log(`New cron job ${uuid} added with schedule ${cronExpression}`);
        return updatedJob[0] as ScheduledJobDto;
    }
}
