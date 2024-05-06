import { ResultsType } from "../enums/enum.results-type";
import { stringifyToCSV } from "../helpers/helper.stringify-to-csv";
import { MinioProvider } from "../providers/minio.provider";
import { db } from "../providers/pg.provider";
import { SchedulerStep } from "../scheduler-step.interface";

export class PgGetStudentTestResults implements SchedulerStep {
    private readonly idTest: number;
    private readonly idCourse: number;
    private readonly resultsType: ResultsType;

    constructor(idTest: number, idCourse: number, resultsType: ResultsType) {
        this.idTest = idTest;
        this.idCourse = idCourse;
        this.resultsType = resultsType;
    }

    async execute(nextInput?: string): Promise<string> {
        const res = await db
            .selectFrom("student")
            .innerJoin("test_instance", "student.id", "test_instance.id_student")
            .innerJoin("test", "test_instance.id_test", "test.id")
            .where("test.id", "=", this.idTest)
            .where("test.id_course", "=", this.idCourse)
            .selectAll()
            .execute();

        const location = "edgar-bucket-pg";
        const fileExtension = this.resultsType === ResultsType.json ? "json" : "csv";
        const objectName = `test-results-${this.idTest}-${this.idCourse}.${fileExtension}`;
        const provider = new MinioProvider(location);

        if (this.resultsType === ResultsType.json) {
            // upload the results as a JSON file
            const output = JSON.stringify(res);
            const buffer = Buffer.from(output);
            await provider.uploadBuffer(objectName, buffer, "application/json");
        } else if (this.resultsType === ResultsType.csv) {
            // upload the results as a CSV file
            const output = await stringifyToCSV(res, { header: true });
            const buffer = Buffer.from(output);
            await provider.uploadBuffer(objectName, buffer, "text/csv");
        }

        return `${location}/${objectName}`;
    }
}
