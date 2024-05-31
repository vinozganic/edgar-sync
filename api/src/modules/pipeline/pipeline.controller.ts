import { Controller, Post, Body } from "@nestjs/common";
import { PipelineService } from "./pipeline.service";
import { ExecutePipelineDto } from "../../dtos/execute-pipeline.dto";
import { UploadFileDto } from "../../dtos/upload-file.dto";
import { PipelineLogger } from "src/pipeline-logger/pipeline-logger";

@Controller("pipeline")
export class PipelineController {
    constructor(private readonly pipelineService: PipelineService) {}

    @Post("execute-pipeline")
    async executePipeline(@Body() executePipelineDto: ExecutePipelineDto) {
        const timestamp = new Date().toISOString().slice(0, 19).replace("T", "_");
        const pipelineLogger = new PipelineLogger(`temp_pipeline_${timestamp}`);
        
        return this.pipelineService.executePipeline(executePipelineDto.steps, pipelineLogger);
    }

    @Post("upload-file")
    async uploadFile(@Body() uploadFileDto: UploadFileDto) {
        return this.pipelineService.uploadFile(uploadFileDto);
    }
}
