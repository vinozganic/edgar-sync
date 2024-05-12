import { TransferObject } from "./dto/dto.transfer-object";

export interface PipelineStep {
    execute(nextInput?: TransferObject): Promise<TransferObject>;
}
