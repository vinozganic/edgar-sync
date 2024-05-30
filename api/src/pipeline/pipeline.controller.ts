import { Controller, Post, Body } from "@nestjs/common";
import { PipelineService } from "./pipeline.service";
import { ExecutePipelineDto } from "../dtos/execute-pipeline.dto";
import { UploadFileDto } from "../dtos/upload-file.dto";

@Controller("pipeline")
export class PipelineController {
    constructor(private readonly pipelineService: PipelineService) {}

    @Post("execute-pipeline")
    async executePipeline(@Body() executePipelineDto: ExecutePipelineDto) {
        return this.pipelineService.executePipeline(executePipelineDto.steps);
    }

    @Post("upload-file")
    async uploadFile(@Body() uploadFileDto: UploadFileDto) {
        return this.pipelineService.uploadFile(uploadFileDto);
    }
}
