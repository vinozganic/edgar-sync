import { MinioProvider } from "../providers/minio.provider";
import { SchedulerStep } from "../scheduler-step.interface";

export class SaveToBucket implements SchedulerStep {
    private readonly bucketName: string;
    private readonly objectName: string;

    constructor(bucketName: string, objectName: string) {
        this.bucketName = bucketName;
        this.objectName = objectName;
    }

    async execute(nextInput?: string): Promise<string> {
        const buffer = Buffer.from(nextInput);

        const provider = new MinioProvider(this.bucketName);
        provider.uploadBuffer(this.objectName, buffer, "application/json");

        return `${this.bucketName}/${this.objectName}`;
    }
}