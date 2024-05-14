import { Injectable } from "@nestjs/common";
import { ExecuteRScript } from "src/pipeline-step/R/r.execute-script";
import { TransferObject } from "src/pipeline-step/dto/dto.transfer-object";
import { PgGetStudentTestResults } from "src/pipeline-step/pg/pg.get-student-test-results";
import { PipelineStep } from "src/pipeline-step/pipeline-step.interface";
import { UploadFileDto } from "./dto/upload-file.dto";
import { ScriptType } from "src/pipeline-step/enums/enum.script-type";
import { MinioProvider } from "src/pipeline-step/providers/minio.provider";
import { getFileNameWithTimestamp } from "src/pipeline-step/helpers/helper-get-file-name-with-timestamp";
// import other classes here

@Injectable()
export class PipelineService {
    async executePipeline(steps: Array<{ name: string; args: any[] }>) {
        const stepInstances: PipelineStep[] = steps.map(step => {
            switch (step.name) {
                case "PgGetStudentTestResults":
                    return new PgGetStudentTestResults(...step.args);
                case "ExecuteRScript":
                    return new ExecuteRScript(...step.args);
                // TODO: Add other steps here
                default:
                    throw new Error(`Invalid step name: ${step.name}`);
            }
        });

        let transferObject = {} as TransferObject;
        for (let step of stepInstances) {
            transferObject = await step.execute(transferObject);
        }

        return transferObject;
    }

    async uploadFile(uploadFileDto: UploadFileDto) {
        const base64Data = Buffer.from(uploadFileDto.base64File, "base64");

        // uploadFileDto.FileName already has a timestamp from frontend
        // const fileNameWithTimestamp = getFileNameWithTimestamp(uploadFileDto.fileName);

        const minioProvider = new MinioProvider("edgar-scripts");
        await minioProvider.uploadBuffer(uploadFileDto.fileName, base64Data, "text/plain");

        return {
            location: "edgar-results",
            objectName: uploadFileDto.fileName,
        } as TransferObject;
    }
}
