import { Controller, Post, Body } from "@nestjs/common";
import { PipelineService } from "./pipeline.service";
import { SetPipelineDto } from "./dto/set-pipeline.dto";
import { UploadFileDto } from "./dto/upload-file.dto";

@Controller("pipeline")
export class PipelineController {
    constructor(private readonly pipelineService: PipelineService) {}

    @Post()
    async setPipeline(@Body() setPipelineDto: SetPipelineDto) {
        return this.pipelineService.executePipeline(setPipelineDto.steps);
    }

    @Post("uploadFile")
    async uploadFile(@Body() uploadFileDto: UploadFileDto) {
        return this.pipelineService.uploadFile(uploadFileDto);
    }
}
