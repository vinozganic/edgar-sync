import { Injectable, InternalServerErrorException, BadRequestException } from "@nestjs/common";
import { ExecuteRScript } from "src/pipeline-logic/pipeline-steps/rscript-steps/r.execute-script";
import { TransferObject } from "src/dtos/dto.transfer-object";
import { PgGetStudentTestResults } from "src/pipeline-logic/pipeline-steps/pg-steps/pg.get-student-test-results";
import { PipelineStep } from "src/pipeline-logic/pipeline-steps/generic-steps/pipeline-step.interface";
import { UploadFileDto } from "../../dtos/upload-file.dto";
import { createPipelineFolder } from "src/helpers/helper.create-pipeline-folder";
import { PgGetStudentsOnCourse } from "src/pipeline-logic/pipeline-steps/pg-steps/pg.get-students-on-course";
import { StepType } from "src/enums/enum.step-type";
import { MongoGetTestLogDetails } from "src/pipeline-logic/pipeline-steps/mongo-steps/mongo.get-testlogdetails";
import { MinioProvider } from "src/pipeline-logic/pipeline-providers/minio.provider";
import { PipelineLogger } from "src/pipeline-logger/pipeline-logger";
import { PgCustomSQLQuery } from "src/pipeline-logic/pipeline-steps/pg-steps/pg.custom-sql-query";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class PipelineService {
    private readonly servicePipelineLogger = PipelineLogger.withoutTimestamp("pipeline-service");

    constructor(private readonly mailerService: MailerService) {}

    async executePipeline(
        steps: Array<{ name: string; args: any[] }>,
        pipelineLogger: PipelineLogger,
        cronJobUuid?: string,
        receiverEmail?: string
    ) {
        try {
            const newFolderName = await createPipelineFolder(cronJobUuid);

            const stepInstances: PipelineStep[] = await this.createStepInstances(steps, pipelineLogger);

            let transferObject = {
                location: newFolderName,
                lastStepType: StepType.dbRecordset,
                pipelineLogger: pipelineLogger,
            } as TransferObject;

            for (let step of stepInstances) {
                transferObject = await step.execute(transferObject);
            }

            const successPipelineMessage = `Pipeline executed successfully, results in ${newFolderName} folder`;
            await this.servicePipelineLogger.writeLog("SUCCESS", PipelineService.name, successPipelineMessage);

            if (receiverEmail) {
                await this.sendEmail(receiverEmail, pipelineLogger, successPipelineMessage);
            }

            return successPipelineMessage;
        } catch (e) {
            const errorPipelineMessage = `Error while executing pipeline for job ${cronJobUuid}: ${e.message}`;
            await this.servicePipelineLogger.writeLog("ERROR", PipelineService.name, errorPipelineMessage);

            if (receiverEmail) {
                await this.sendEmail(receiverEmail, pipelineLogger, errorPipelineMessage);
            }

            throw new InternalServerErrorException(
                `Error while executing pipeline for job ${cronJobUuid}: ${e.message}`
            );
        }
    }

    async uploadFile(uploadFileDto: UploadFileDto) {
        try {
            const base64Data = Buffer.from(uploadFileDto.base64File, "base64");

            const minioProvider = new MinioProvider("edgar-scripts");
            await minioProvider.uploadBuffer(uploadFileDto.fileName, base64Data, "text/plain");

            return {
                location: "edgar-scripts",
                objectName: uploadFileDto.fileName,
            } as TransferObject;
        } catch (e) {
            await this.servicePipelineLogger.writeLog(
                "ERROR",
                PipelineService.name,
                `Error while uploading script: ${e.message}`
            );
            throw new InternalServerErrorException(`Error while uploading script: ${e.message}`);
        }
    }

    private async createStepInstances(
        steps: Array<{ name: string; args: any[] }>,
        pipelineLogger: PipelineLogger
    ): Promise<PipelineStep[]> {
        const stepInstances: PipelineStep[] = [];

        for (const step of steps) {
            switch (step.name) {
                case "PgGetStudentTestResults":
                    stepInstances.push(new PgGetStudentTestResults(...step.args));
                    break;
                case "PgGetStudentsOnCourse":
                    stepInstances.push(new PgGetStudentsOnCourse(...step.args));
                    break;
                case "MongoGetTestLogDetails":
                    stepInstances.push(new MongoGetTestLogDetails(...step.args));
                    break;
                case "PgCustomSQLQuery":
                    stepInstances.push(new PgCustomSQLQuery(...step.args));
                    break;
                case "ExecuteRScript":
                    stepInstances.push(new ExecuteRScript(...step.args));
                    break;
                // TODO: Add other steps here
                default:
                    await pipelineLogger.writeLog(
                        "ERROR",
                        PipelineService.name,
                        "Unknown step type in pipeline steps array"
                    );
                    throw new BadRequestException("Unknown step type in pipeline steps array");
            }
        }

        return stepInstances;
    }

    private async sendEmail(receiverEmail: string, pipelineLogger: PipelineLogger, pipelineMessage: string) {
        const log = await pipelineLogger.getLog();

        try {
            await this.mailerService.sendMail({
                to: receiverEmail,
                from: "edgarsync.notificator@gmail.com",
                subject: "EdgarSync - Pipeline Execution Notification",
                template: "pipeline-email",
                context: {
                    pipelineMessage: pipelineMessage,
                    log: log,
                },
            });

            this.servicePipelineLogger.writeLog(
                "INFO",
                PipelineService.name,
                `Email successfully sent to ${receiverEmail}`
            );
        } catch (e) {
            this.servicePipelineLogger.writeLog(
                "ERROR",
                PipelineService.name,
                `Error while sending email: ${e.message}`
            );
            throw new InternalServerErrorException(`Error while sending email: ${e.message}`);
        }
    }
}
