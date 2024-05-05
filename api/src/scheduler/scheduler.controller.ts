import { Controller, Post, Body } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { SchedulerService } from "./scheduler.service";
import { SetScheduleDto } from "./dto/set-schedule.dto";

@Controller()
export class ScheduleController {
    constructor(private schedulerService: SchedulerService) {}

    @Post("set-schedule")
    async setSchedule(@Body() setScheduleDto: SetScheduleDto) {
        // return this.schedulerService.setSchedule(setScheduleDto.cronExpression);
    }
}
