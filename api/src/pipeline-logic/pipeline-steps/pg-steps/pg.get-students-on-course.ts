import { TransferObject } from "../../../dtos/dto.transfer-object";
import { PipelineStep } from "../generic-steps/pipeline-step.interface";
import { getFileNameWithTimestamp } from "../../../helpers/helper.get-file-name-with-timestamp";
import { DbResultsType } from "src/enums/enum.db-results-type";
import { stringifyToCSV } from "src/helpers/helper.stringify-to-csv";
import { StepType } from "src/enums/enum.step-type";
import { edgarDb } from "src/pipeline-logic/pipeline-providers/pg.provider";
import { MinioProvider } from "src/pipeline-logic/pipeline-providers/minio.provider";

export class PgGetStudentsOnCourse implements PipelineStep {
    private readonly idCourse: number;
    private readonly idAcademicYear: number;
    private readonly dbResultsType: DbResultsType;

    constructor(...args: any[]) {
        [this.idCourse, this.idAcademicYear, this.dbResultsType] = args;
    }

    async execute(transferObject?: TransferObject): Promise<TransferObject> {
        const pipelineLogger = transferObject?.pipelineLogger;

        const res = await edgarDb
            .selectFrom("student")
            .innerJoin("student_course", "student.id", "student_course.id_student")
            .innerJoin("course", "student_course.id_course", "course.id")
            .where("student_course.id_course", "=", this.idCourse)
            .where("student_course.id_academic_year", "=", this.idAcademicYear)
            .selectAll("student")
            .execute();

        if (!res.length) {
            await pipelineLogger.writeLog("ERROR", "PgGetStudentsOnCourse", "No results found from database query");
            throw new Error("No results found from database query");
        }

        const location = `${transferObject.location}/db-recordsets`;
        const fileExtension = this.dbResultsType === DbResultsType.json ? "json" : "csv";
        const fileName = `students-on-course-${this.idCourse}-${this.idAcademicYear}.${fileExtension}`;
        const fileNameWithTimestamp = getFileNameWithTimestamp(fileName);
        const fullFileName = `${location}/${fileNameWithTimestamp}`;

        const provider = new MinioProvider("edgar-pipelines");
        try {
            if (this.dbResultsType === DbResultsType.json) {
                // upload the results as a JSON file
                const output = JSON.stringify(res);
                const buffer = Buffer.from(output);
                await provider.uploadBuffer(fullFileName, buffer, "application/json");
            } else if (this.dbResultsType === DbResultsType.csv) {
                // upload the results as a CSV file
                const output = await stringifyToCSV(res, { header: true });
                const buffer = Buffer.from(output);
                await provider.uploadBuffer(fullFileName, buffer, "text/csv");
            }
        } catch (e) {
            await pipelineLogger.writeLog(
                "ERROR",
                "PgGetStudentsOnCourse",
                "Error while uploading database result file to Minio"
            );
            throw new Error("Error while uploading database result file to Minio");
        }

        await pipelineLogger.writeLog(
            "SUCCESS",
            "PgGetStudentTestResults",
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
