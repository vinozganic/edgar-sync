import { Controller, Post, Body } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { PipelineService } from "./pipeline.service";
import { SetPipelineDto } from "./dto/set-pipeline.dto";

@Controller()
export class PipelineController {
    constructor(private pipelineService: PipelineService) {}

    @Post("set-schedule")
    async setSchedule(@Body() setPipelineDto: SetPipelineDto) {
        // return this.schedulerService.setSchedule(setScheduleDto.cronExpression);
    }
}
