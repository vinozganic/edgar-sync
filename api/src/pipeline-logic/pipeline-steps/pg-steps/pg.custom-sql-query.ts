import { TransferObject } from "../../../dtos/dto.transfer-object";
import { DbResultsType } from "../../../enums/enum.db-results-type";
import { stringifyToCSV } from "../../../helpers/helper.stringify-to-csv";
import { PipelineStep } from "../generic-steps/pipeline-step.interface";
import { getFileNameWithTimestamp } from "../../../helpers/helper.get-file-name-with-timestamp";
import { StepType } from "src/enums/enum.step-type";
import { edgarDb } from "src/pipeline-logic/pipeline-providers/pg.provider";
import { MinioProvider } from "src/pipeline-logic/pipeline-providers/minio.provider";
import { Parser } from "node-sql-parser";
import { sql } from "kysely";

export class PgCustomSQLQuery implements PipelineStep {
    private readonly query: string;
    private readonly dbResultsType: DbResultsType;

    constructor(...args: any[]) {
        [this.query, this.dbResultsType] = args;
    }

    async execute(transferObject?: TransferObject): Promise<TransferObject> {
        const pipelineLogger = transferObject?.pipelineLogger;

        try {
            const parser = new Parser();
            const ast = parser.astify(this.query);
        } catch (e) {
            await pipelineLogger.writeLog("ERROR", "PgCustomSQLQuery", "Error while parsing SQL query");
            throw new Error("Error while parsing SQL query");
        }

        let res;
        try {
            res = await sql`${sql.raw(this.query)}`.execute(edgarDb);
        } catch (e) {
            await pipelineLogger.writeLog("ERROR", "PgCustomSQLQuery", `Error while executing SQL query: ${e.message}`);
            throw new Error(`Error while executing SQL query: ${e.message}`);
        }

        if (!res) {
            await pipelineLogger.writeLog("ERROR", "PgCustomSQLQuery", "No results found from SQL query");
            throw new Error("No results found from SQL query");
        }

        const location = `${transferObject.location}/db-recordsets`;
        const fileExtension = this.dbResultsType === DbResultsType.json ? "json" : "csv";
        const fileName = `custom-query-results.${fileExtension}`;
        const fileNameWithTimestamp = getFileNameWithTimestamp(fileName);
        const fullFileName = `${location}/${fileNameWithTimestamp}`;

        const provider = new MinioProvider("edgar-pipelines");
        try {
            if (this.dbResultsType === DbResultsType.json) {
                // Upload the results as a JSON file
                const output = JSON.stringify(res.rows);
                const buffer = Buffer.from(output);
                await provider.uploadBuffer(fullFileName, buffer, "application/json");
            } else if (this.dbResultsType === DbResultsType.csv) {
                // Upload the results as a CSV file
                const output = await stringifyToCSV(res.rows, { header: true });
                const buffer = Buffer.from(output);
                await provider.uploadBuffer(fullFileName, buffer, "text/csv");
            }
        } catch (e) {
            await pipelineLogger.writeLog(
                "ERROR",
                "PgCustomSQLQuery",
                `Error while uploading result file to Minio: ${e.message}`
            );
            throw new Error(`Error while uploading result file to Minio: ${e.message}`);
        }

        await pipelineLogger.writeLog(
            "SUCCESS",
            "PgCustomSQLQuery",
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
