import { Injectable } from "@nestjs/common";
import { config } from "dotenv";
import { DbResultsType } from "src/scheduler-step/enums/enum.db-results-type";
import { ScriptResultsType } from "src/scheduler-step/enums/enum.script-results-type";
import { ScriptType } from "src/scheduler-step/enums/enum.script-type";
import { MongoGetTestlogdetails } from "src/scheduler-step/mongo/mongo.get-testlogdetails";
import { PgGetStudentTestResults } from "src/scheduler-step/pg/pg.get-student-test-results";
import { ExecuteRScript } from "src/scheduler-step/R/r.execute-script";
import { SchedulerStep } from "src/scheduler-step/scheduler-step.interface";

config();

@Injectable()
export class TestService {
    constructor() {}

    async executeTest(idTest: number, idCourse: number) {
        const getStudentsTestResults = new PgGetStudentTestResults(idTest, idCourse, DbResultsType.csv);
        const executeRScript = new ExecuteRScript(
            "csv_test.R",
            ScriptType.r,
            DbResultsType.csv,
            ScriptResultsType.csv
        );

        let steps: SchedulerStep[] = [getStudentsTestResults, executeRScript];

        let nextInput = "";
        for (let step of steps) {
            nextInput = await step.execute(nextInput);
        }

        return "Test executed successfully";
    }
}
