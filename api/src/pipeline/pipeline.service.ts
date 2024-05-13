import { Injectable } from "@nestjs/common";
import { ExecuteRScript } from "src/pipeline-step/R/r.execute-script";
import { TransferObject } from "src/pipeline-step/dto/dto.transfer-object";
import { PgGetStudentTestResults } from "src/pipeline-step/pg/pg.get-student-test-results";
import { PipelineStep } from "src/pipeline-step/pipeline-step.interface";
import { UploadFileDto } from "./dto/upload-file.dto";
import { ScriptType } from "src/pipeline-step/enums/enum.script-type";
import { MinioProvider } from "src/pipeline-step/providers/minio.provider";
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
                // add other cases here
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

        const minioProvider = new MinioProvider("edgar-bucket-r");
        await minioProvider.uploadBuffer(uploadFileDto.fileName, base64Data, "text/plain");

        return {
            location: "edgar-bucket-r-results",
            objectName: uploadFileDto.fileName,
        } as TransferObject;
    }
}
