import { IsArray } from "class-validator";
import { PipelineStepDto } from "./pipeline-step.dto";

export class SetPipelineDto {
    @IsArray()
    steps: PipelineStepDto[];
}
