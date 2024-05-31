import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
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
import { PipelineLogger } from "src/pipeline-logger/pipeline-logger";

config();

@Injectable()
export class SchedulerService {
    private readonly servicePipelineLogger = PipelineLogger.withoutTimestamp("scheduler-service");

    constructor(
        @Inject(PG_SYNC_CONNECTION) private edgarSyncDb: Kysely<EdgarSyncDB>,
        private schedulerRegistry: SchedulerRegistry,
        private pipelineService: PipelineService
    ) {}

    async onModuleInit() {
        // await this.loadScheduledJobsOnStart();
    }

    async loadScheduledJobsOnStart() {
        try {
            const scheduledJobs = await this.getAllScheduledJobs();
            for (const job of scheduledJobs) {
                const cronJob = new CronJob(job.cronJob, async () => {
                    try {
                        await this.servicePipelineLogger.writeLog(
                            "INFO",
                            "SchedulerService",
                            `Executing pipeline steps for job '${job.name}' (${job.uuid})`
                        );
                        await this.pipelineService.executePipeline(job.steps, job.uuid);
                    } catch (e) {
                        await this.servicePipelineLogger.writeLog(
                            "ERROR",
                            "SchedulerService",
                            `Error executing job '${job.name}' (${job.uuid}): ${e.message}`
                        );
                    }
                });
                this.schedulerRegistry.addCronJob(job.uuid, cronJob);
                cronJob.start();
                await this.servicePipelineLogger.writeLog(
                    "SUCCESS",
                    "SchedulerService",
                    `Cron job '${job.name}' (${job.uuid}) added with schedule ${job.cronJob}`
                );
            }
        } catch (e) {
            await this.servicePipelineLogger.writeLog(
                "ERROR",
                "SchedulerService",
                `Error while loading scheduled jobs on application start: ${e.message}`
            );
            throw new InternalServerErrorException(
                `Error while loading scheduled jobs on application start: ${e.message}`
            );
        }
    }

    async createScheduledJob(createUpdateScheduledJobDto: CreateUpdateScheduledJobDto) {
        try {
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

            // Create a cron job
            const job = new CronJob(cronExpression, async () => {
                try {
                    await this.servicePipelineLogger.writeLog(
                        "INFO",
                        "SchedulerService",
                        `Executing pipeline steps for job '${createUpdateScheduledJobDto.name}' (${createdJobUuid})`
                    );
                    await this.pipelineService.executePipeline(steps, createdJobUuid);
                } catch (e) {
                    await this.servicePipelineLogger.writeLog(
                        "ERROR",
                        "SchedulerService",
                        `Error executing job '${createUpdateScheduledJobDto.name}' (${createdJobUuid}): ${e.message}`
                    );
                }
            });
            this.schedulerRegistry.addCronJob(createdJobUuid, job);
            job.start();

            await this.servicePipelineLogger.writeLog(
                "SUCCESS",
                "SchedulerService",
                `Cron job '${createUpdateScheduledJobDto.name}' (${createdJobUuid}) added with schedule ${createUpdateScheduledJobDto.cronJob}`
            );

            return {
                message: `Cron job '${createUpdateScheduledJobDto.name}' (${createdJobUuid}) added with schedule ${createUpdateScheduledJobDto.cronJob}`,
            };
        } catch (e) {
            await this.servicePipelineLogger.writeLog("ERROR", "SchedulerService", e.message);
            throw new InternalServerErrorException(`Error while creating scheduled job: ${e.message}`);
        }
    }

    async getAllScheduledJobs() {
        try {
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
                        } catch (e) {
                            await this.servicePipelineLogger.writeLog(
                                "ERROR",
                                "SchedulerService",
                                `Error while reading script file in job '${job.name}' ('${job.uuid}')`
                            );
                        }
                    }
                }
            }
            return res;
        } catch (e) {
            await this.servicePipelineLogger.writeLog(
                "ERROR",
                "SchedulerService",
                `Error while fetching all scheduled jobs: ${e.message}`
            );
            throw new InternalServerErrorException(`Error while fetching all scheduled jobs: ${e.message}`);
        }
    }

    async deleteScheduledJob(uuid: string) {
        try {
            this.schedulerRegistry.deleteCronJob(uuid);
            const res = (
                await this.edgarSyncDb
                    .deleteFrom("scheduledJobs")
                    .where("uuid", "=", uuid)
                    .returning(["uuid", "name", "steps", "cronJob", "created", "lastModified"])
                    .execute()
            )[0];

            await this.servicePipelineLogger.writeLog(
                "SUCCESS",
                "SchedulerService",
                `Cron job '${res.name}' (${res.uuid}) successfully deleted.`
            );

            return res as ScheduledJobDto;
        } catch (e) {
            await this.servicePipelineLogger.writeLog(
                "ERROR",
                "SchedulerService",
                `Error while deleting cron job: ${e.message}`
            );
            throw new InternalServerErrorException(`Error while deleting cron job: ${e.message}`);
        }
    }

    async updateScheduledJob(uuid: string, createUpdateScheduledJobDto: CreateUpdateScheduledJobDto) {
        try {
            const { name, steps, cronJob: cronExpression } = createUpdateScheduledJobDto;

            // Delete existing cron job
            this.schedulerRegistry.deleteCronJob(uuid);

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
                try {
                    await this.servicePipelineLogger.writeLog(
                        "INFO",
                        "SchedulerService",
                        `Executing pipeline steps for job '${name}' (${uuid})`
                    );
                    await this.pipelineService.executePipeline(steps, uuid);
                } catch (e) {
                    await this.servicePipelineLogger.writeLog(
                        "ERROR",
                        "SchedulerService",
                        `Error executing job '${name}' (${uuid}): ${e.message}`
                    );
                }
            });
            this.schedulerRegistry.addCronJob(uuid, job);
            job.start();

            await this.servicePipelineLogger.writeLog(
                "SUCCESS",
                "SchedulerService",
                `Cron job '${name}' (${uuid}) successfully updated.`
            );

            return updatedJob[0] as ScheduledJobDto;
        } catch (e) {
            await this.servicePipelineLogger.writeLog(
                "ERROR",
                "SchedulerService",
                `Error while updating cron job: ${e.message}`
            );
            throw new InternalServerErrorException(`Error while updating cron job: ${e.message}`);
        }
    }
}
