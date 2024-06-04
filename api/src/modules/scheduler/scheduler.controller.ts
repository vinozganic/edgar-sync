import { Controller, Post, Body, Get, Delete, Query, Patch } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";
import { ApiBody, ApiQuery } from "@nestjs/swagger";
import { CreateUpdateScheduledJobDto } from "src/dtos/create-update-scheduled-job.dto";

@Controller("scheduler")
export class SchedulerController {
    constructor(private readonly schedulerService: SchedulerService) {}

    @Post("create-scheduled-job")
    async createScheduledJob(@Body() createUpdateScheduledJobDto: CreateUpdateScheduledJobDto) {
        return this.schedulerService.createScheduledJob(createUpdateScheduledJobDto);
    }

    @Get("get-all-scheduled-jobs")
    async getAllScheduledJobs() {
        return this.schedulerService.getAllScheduledJobs(true);
    }

    @Delete("delete-scheduled-job")
    @ApiQuery({ name: "uuid", required: true, type: String })
    async deleteScheduledJob(@Query("uuid") uuid: string) {
        return this.schedulerService.deleteScheduledJob(uuid);
    }

    @Patch("update-scheduled-job")
    @ApiQuery({ name: "uuid", required: true, type: String })
    @ApiBody({ required: true, type: CreateUpdateScheduledJobDto })
    async updateScheduledJob(
        @Query("uuid") uuid: string,
        @Body() createUpdateScheduledJobDto: CreateUpdateScheduledJobDto
    ) {
        return this.schedulerService.updateScheduledJob(uuid, createUpdateScheduledJobDto);
    }

    @Get("get-all-finished-scheduled-jobs")
    async getAllFinishedScheduledJobs() {
        return this.schedulerService.getAllFinishedScheduledJobs();
    }
}
