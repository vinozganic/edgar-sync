import { TestLogDetailsModel } from "src/mongo/schemas/testlogdetails.schema";
import { SchedulerStep } from "../scheduler-step.interface";
import { MinioProvider } from "../providers/minio.provider";
import { TransferObject } from "../dtos/dto.transfer-object";

export class MongoGetTestlogdetails implements SchedulerStep {
    private readonly idTestInstance: string;

    constructor(idTestInstance: string) {
        this.idTestInstance = idTestInstance;
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
