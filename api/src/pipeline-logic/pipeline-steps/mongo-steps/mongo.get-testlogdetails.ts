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
        const pipelineLogger = transferObject?.pipelineLogger;

        const res = await TestLogDetailsModel.find({ id_test_instance: this.idTestInstance }).exec();

        if (!res.length) {
            await pipelineLogger.writeLog("ERROR", "MongoGetTestLogDetails", "No results found from database query");
            throw new Error("No results found from database query");
        }

        const buffer = Buffer.from(JSON.stringify(res));

        const location = `${transferObject.location}/db-recordsets`;
        const fileName = `test-log-details-${this.idTestInstance}.json`;
        const fileNameWithTimestamp = getFileNameWithTimestamp(fileName);
        const fullFileName = `${location}/${fileNameWithTimestamp}`;

        const provider = new MinioProvider("edgar-pipelines");

        try {
            provider.uploadBuffer(fullFileName, buffer, "application/json");
        } catch (e) {
            await pipelineLogger.writeLog(
                "ERROR",
                "MongoGetTestLogDetails",
                "Error while uploading database result file to Minio"
            );
            throw new Error("Error while uploading database result file to Minio");
        }

        await pipelineLogger.writeLog(
            "SUCCESS",
            "MongoGetTestLogDetails",
            `Successfully executed query and uploaded ${fileName} to Minio`
        );

        return {
            location: transferObject.location,
            objectName: fileNameWithTimestamp,
            lastStepType: StepType.dbRecordset,
            pipelineLogger: pipelineLogger,
        } as TransferObject;
    }
}
