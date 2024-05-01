import { Injectable } from "@nestjs/common";
import { config } from "dotenv";
import { TestLogDetailsModel } from "./schemas/testlogdetails.schema";
import { MinioService } from "src/minio/minio.service";

config();

@Injectable()
export class MongoService {
    constructor(private readonly minioService: MinioService) {}

    async getTestLogDetails(idTestInstance: string) {
        const res = await TestLogDetailsModel.find({ id_test_instance: idTestInstance }).exec();

        const buffer = Buffer.from(JSON.stringify(res));
        const objectName = `test-log-details-${idTestInstance}.json`;

        await this.minioService.uploadBuffer(objectName, buffer, "application/json");

        return res;
    }
}
