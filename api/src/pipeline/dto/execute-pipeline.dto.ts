import { IsArray } from "class-validator";
import { PipelineStepDto } from "./pipeline-step.dto";

export class ExecutePipelineDto {
    @IsArray()
    steps: PipelineStepDto[];
}
