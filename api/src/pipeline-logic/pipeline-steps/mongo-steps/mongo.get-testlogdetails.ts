import { TestLogDetailsModel } from "src/modules/mongo/schemas/testlogdetails.schema";
import { PipelineStep } from "../generic-steps/pipeline-step.interface";
import { TransferObject } from "../../../dtos/dto.transfer-object";
import { getFileNameWithTimestamp } from "../../../helpers/helper.get-file-name-with-timestamp";
import { StepType } from "src/enums/enum.step-type";
import { MinioProvider } from "src/pipeline-logic/pipeline-providers/minio.provider";

export class MongoGetTestLogDetails implements PipelineStep {
    private readonly idTestInstance: string;

    constructor(...args: any[]) {
        [this.idTestInstance] = args;
    }

    async execute(transferObject?: TransferObject): Promise<TransferObject> {
        const res = await TestLogDetailsModel.find({ id_test_instance: this.idTestInstance }).exec();

        const buffer = Buffer.from(JSON.stringify(res));

        const location = `${transferObject.location}/db-recordsets`;
        const fileName = `test-log-details-${this.idTestInstance}.json`;
        const fileNameWithTimestamp = getFileNameWithTimestamp(fileName);
        const fullFileName = `${location}/${fileNameWithTimestamp}`;

        const provider = new MinioProvider("edgar-pipelines");
        provider.uploadBuffer(fullFileName, buffer, "application/json");

        return {
            location: transferObject.location,
            objectName: fileNameWithTimestamp,
            lastStepType: StepType.dbRecordset,
        } as TransferObject;
    }
}
