import { IsArray, IsString } from "class-validator";
import { PipelineStepDto } from "src/dtos/pipeline-step.dto";

export class CreateUpdateScheduledJobDto {
    @IsString()
    name: string;

    @IsString()
    jobName: string;

    @IsArray()
    steps: PipelineStepDto[];

    @IsString()
    cronJob: string;

    @IsString()
    email?: string;
}
