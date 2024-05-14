import { TransferObject } from "../dto/dto.transfer-object";
import { DbResultsType } from "../enums/enum.db-results-type";
import { stringifyToCSV } from "../helpers/helper.stringify-to-csv";
import { MinioProvider } from "../providers/minio.provider";
import { db } from "../providers/pg.provider";
import { PipelineStep } from "../pipeline-step.interface";
import { getFileNameWithTimestamp } from "../helpers/helper-get-file-name-with-timestamp";

export class PgGetStudentTestResults implements PipelineStep {
    private readonly idTest: number;
    private readonly idCourse: number;
    private readonly dbResultsType: DbResultsType;

    constructor(...args: any[]) {
        [this.idTest, this.idCourse, this.dbResultsType] = args;
    }

    async execute(transferObject?: TransferObject): Promise<TransferObject> {
        const res = await db
            .selectFrom("student")
            .innerJoin("test_instance", "student.id", "test_instance.id_student")
            .innerJoin("test", "test_instance.id_test", "test.id")
            .where("test.id", "=", this.idTest)
            .where("test.id_course", "=", this.idCourse)
            .selectAll()
            .execute();

        const location = "edgar-db-recordsets";
        const fileExtension = this.dbResultsType === DbResultsType.json ? "json" : "csv";
        const fileName = `test-results-${this.idTest}-${this.idCourse}.${fileExtension}`;
        const fileNameWithTimestamp = getFileNameWithTimestamp(fileName);

        const provider = new MinioProvider(location);
        if (this.dbResultsType === DbResultsType.json) {
            // upload the results as a JSON file
            const output = JSON.stringify(res);
            const buffer = Buffer.from(output);
            await provider.uploadBuffer(fileNameWithTimestamp, buffer, "application/json");
        } else if (this.dbResultsType === DbResultsType.csv) {
            // upload the results as a CSV file
            const output = await stringifyToCSV(res, { header: true });
            const buffer = Buffer.from(output);
            await provider.uploadBuffer(fileNameWithTimestamp, buffer, "text/csv");
        }

        return {
            location: location,
            objectName: fileNameWithTimestamp,
        } as TransferObject;
    }
}
