import { TransferObject } from "./dtos/dto.transfer-object";

export interface SchedulerStep {
    execute(nextInput?: TransferObject): Promise<TransferObject>;
}
