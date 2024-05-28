import { TestLogDetailsModel } from "src/mongo/schemas/testlogdetails.schema";
import { PipelineStep } from "../pipeline-step.interface";
import { MinioProvider } from "../../providers/minio.provider";
import { TransferObject } from "../../dto/dto.transfer-object";
import { getFileNameWithTimestamp } from "../../helpers/helper.get-file-name-with-timestamp";
import { StepType } from "src/pipeline-step/enums/enum.step-type";

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
