import { PipelineLogger } from "src/pipeline-logger/pipeline-logger";
import { StepType } from "../enums/enum.step-type";

export class TransferObject {
    readonly location: string;
    readonly objectName: string;
    readonly lastStepType: StepType;
    readonly pipelineLogger: PipelineLogger;
}
