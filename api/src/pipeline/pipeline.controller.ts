import { Controller, Post, Body } from "@nestjs/common";
import { PipelineService } from "./pipeline.service";
import { SetPipelineDto } from "./dto/set-pipeline.dto";

@Controller("pipeline")
export class PipelineController {
    constructor(private readonly pipelineService: PipelineService) {}

    @Post()
    async setPipeline(@Body() setPipelineDto: SetPipelineDto) {
        return this.pipelineService.executePipeline(setPipelineDto.steps);
    }
}
