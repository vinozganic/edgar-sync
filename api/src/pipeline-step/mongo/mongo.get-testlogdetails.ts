import { TestLogDetailsModel } from "src/mongo/schemas/testlogdetails.schema";
import { PipelineStep } from "../pipeline-step.interface";
import { MinioProvider } from "../providers/minio.provider";
import { TransferObject } from "../dto/dto.transfer-object";
import { getFileNameWithTimestamp } from "../helpers/helper-get-file-name-with-timestamp";

export class MongoGetTestLogDetails implements PipelineStep {
    private readonly idTestInstance: string;

    constructor(...args: any[]) {
        [this.idTestInstance] = args;
    }

    async execute(transferObject?: TransferObject): Promise<TransferObject> {
        const res = await TestLogDetailsModel.find({ id_test_instance: this.idTestInstance }).exec();

        const buffer = Buffer.from(JSON.stringify(res));
        const fileName = `test-log-details-${this.idTestInstance}.json`;
        const fileNameWithTimestamp = getFileNameWithTimestamp(fileName);

        const location = "edgar-db-redordsets";
        const provider = new MinioProvider(location);
        provider.uploadBuffer(fileNameWithTimestamp, buffer, "application/json");

        return {
            location: location,
            objectName: fileNameWithTimestamp,
        } as TransferObject;
    }
}
