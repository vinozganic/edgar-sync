import { Injectable } from "@nestjs/common";
import { config } from "dotenv";
import { TransferObject } from "src/pipeline-step/dto/dto.transfer-object";
import { DbResultsType } from "src/pipeline-step/enums/enum.db-results-type";
import { ScriptResultsType } from "src/pipeline-step/enums/enum.script-results-type";
import { ScriptType } from "src/pipeline-step/enums/enum.script-type";
import { MongoGetTestLogDetails } from "src/pipeline-step/mongo/mongo.get-testlogdetails";
import { PgGetStudentTestResults } from "src/pipeline-step/pg/pg.get-student-test-results";
import { ExecuteRScript } from "src/pipeline-step/R/r.execute-script";
import { PipelineStep } from "src/pipeline-step/pipeline-step.interface";

config();

@Injectable()
export class TestService {
    constructor() {}

    async executeTest(idTest: number, idCourse: number) {
        const getStudentsTestResults = new PgGetStudentTestResults(idTest, idCourse, DbResultsType.csv);
        const executeRScript = new ExecuteRScript("csv_test.R", ScriptType.r, DbResultsType.csv, ScriptResultsType.csv);

        let steps: PipelineStep[] = [getStudentsTestResults, executeRScript];

        let transferObject = {} as TransferObject;
        for (let step of steps) {
            transferObject = await step.execute(transferObject);
        }

        return "Test executed successfully";
    }
}
