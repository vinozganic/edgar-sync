import { IsArray, IsString } from "class-validator";
import { PipelineStepDto } from "src/pipeline/dto/pipeline-step.dto";

export class CreateUpdateScheduledJobDto {
    @IsString()
    name: string;

    @IsString()
    jobName: string;

    @IsArray()
    steps: PipelineStepDto[];

    @IsString()
    cronJob: string;
}
