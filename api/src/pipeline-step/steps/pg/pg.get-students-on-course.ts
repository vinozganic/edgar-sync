import { TransferObject } from "../../dto/dto.transfer-object";
import { MinioProvider } from "../../providers/minio.provider";
import { edgarDb } from "../../providers/pg.provider";
import { PipelineStep } from "../pipeline-step.interface";
import { getFileNameWithTimestamp } from "../../helpers/helper.get-file-name-with-timestamp";
import { DbResultsType } from "src/pipeline-step/enums/enum.db-results-type";
import { stringifyToCSV } from "src/pipeline-step/helpers/helper.stringify-to-csv";
import { StepType } from "src/pipeline-step/enums/enum.step-type";

export class PgGetStudentsOnCourse implements PipelineStep {
    private readonly idCourse: number;
    private readonly idAcademicYear: number;
    private readonly dbResultsType: DbResultsType;

    constructor(...args: any[]) {
        [this.idCourse, this.idAcademicYear] = args;
    }

    async execute(transferObject?: TransferObject): Promise<TransferObject> {
        const res = await edgarDb
            .selectFrom("student")
            .innerJoin("student_course", "student.id", "student_course.id_student")
            .innerJoin("course", "student_course.id_course", "course.id")
            .where("student_course.id_course", "=", this.idCourse)
            .where("student_course.id_academic_year", "=", this.idAcademicYear)
            .selectAll("student")
            .execute();

        const location = `${transferObject.location}/db-recordsets`;
        const fileExtension = this.dbResultsType === DbResultsType.json ? "json" : "csv";
        const fileName = `students-on-course-${this.idCourse}-${this.idAcademicYear}.${fileExtension}`;
        const fileNameWithTimestamp = getFileNameWithTimestamp(fileName);
        const fullFileName = `${location}/${fileNameWithTimestamp}`;

        const provider = new MinioProvider(location);
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

        return {
            location: transferObject.location,
            objectName: fileNameWithTimestamp,
            lastStepType: StepType.dbRecordset,
        } as TransferObject;
    }
}
