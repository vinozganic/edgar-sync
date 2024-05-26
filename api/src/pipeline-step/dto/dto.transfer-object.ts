import { StepType } from "../enums/enum.step-type";

export class TransferObject {
    readonly location: string;
    readonly objectName: string;
    readonly lastStepType: StepType;
}
