import { TransferObject } from "../../dtos/dto.transfer-object";

export interface PipelineStep {
    execute(nextInput?: TransferObject): Promise<TransferObject>;
}
