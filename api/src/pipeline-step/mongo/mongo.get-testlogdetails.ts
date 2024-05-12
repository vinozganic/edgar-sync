import { TestLogDetailsModel } from "src/mongo/schemas/testlogdetails.schema";
import { PipelineStep } from "../pipeline-step.interface";
import { MinioProvider } from "../providers/minio.provider";
import { TransferObject } from "../dto/dto.transfer-object";

export class MongoGetTestLogDetails implements PipelineStep {
    private readonly idTestInstance: string;

    constructor(...args: any[]) {
        [this.idTestInstance] = args;
    }

    async execute(transferObject?: TransferObject): Promise<TransferObject> {
        const res = await TestLogDetailsModel.find({ id_test_instance: this.idTestInstance }).exec();

        const buffer = Buffer.from(JSON.stringify(res));
        const objectName = `test-log-details-${this.idTestInstance}.json`;

        const location = "edgar-bucket-mongo";
        const provider = new MinioProvider(location);
        provider.uploadBuffer(objectName, buffer, "application/json");

        return {
            location,
            objectName,
        } as TransferObject;
    }
}
