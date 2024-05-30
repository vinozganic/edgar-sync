import { Injectable } from "@nestjs/common";
import { ExecuteRScript } from "src/pipeline-logic/steps/R/r.execute-script";
import { TransferObject } from "src/dtos/dto.transfer-object";
import { PgGetStudentTestResults } from "src/pipeline-logic/steps/pg/pg.get-student-test-results";
import { PipelineStep } from "src/pipeline-logic/steps/pipeline-step.interface";
import { UploadFileDto } from "../dtos/upload-file.dto";
import { MinioProvider } from "src/pipeline-logic/providers/minio.provider";
import { getFileNameWithTimestamp } from "src/helpers/helper.get-file-name-with-timestamp";
import { createPipelineFolder } from "src/helpers/helper.create-pipeline-folder";
import { PgGetStudentsOnCourse } from "src/pipeline-logic/steps/pg/pg.get-students-on-course";
import { StepType } from "src/enums/enum.step-type";
import { MongoGetTestLogDetails } from "src/pipeline-logic/steps/mongo/mongo.get-testlogdetails";

@Injectable()
export class PipelineService {
    async executePipeline(steps: Array<{ name: string; args: any[] }>, cronJobId?: string) {
        // const cronJobId2 = "de036c01-5230-4194-a26f-b94bf3c3da51"; // for testing
        const newFolderName = await createPipelineFolder(cronJobId);

        const stepInstances: PipelineStep[] = steps.map(step => {
            switch (step.name) {
                case "PgGetStudentTestResults":
                    return new PgGetStudentTestResults(...step.args);
                case "PgGetStudentsOnCourse":
                    return new PgGetStudentsOnCourse(...step.args);
                case "MongoGetTestLogDetails":
                    return new MongoGetTestLogDetails(...step.args);
                case "ExecuteRScript":
                    return new ExecuteRScript(...step.args);
                // TODO: Add other steps here
                default:
                    throw new Error(`Invalid step name: ${step.name}`);
            }
        });

        let transferObject = { location: newFolderName, lastStepType: StepType.dbRecordset } as TransferObject;
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
            location: "edgar-scripts",
            objectName: uploadFileDto.fileName,
        } as TransferObject;
    }
}
