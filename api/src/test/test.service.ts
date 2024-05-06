import { Injectable } from "@nestjs/common";
import { config } from "dotenv";
import { ResultsType } from "src/scheduler-step/enums/enum.results-type";
import { PgGetStudentTestResults } from "src/scheduler-step/pg/pg.get-student-test-results";
import { ExecuteRScript } from "src/scheduler-step/R/r.execute-script";
import { SchedulerStep } from "src/scheduler-step/scheduler-step.interface";

config();

@Injectable()
export class TestService {
    constructor() {}

    async executeTest(idTest: number, idCourse: number) {
        const getStudentsTestResults = new PgGetStudentTestResults(idTest, idCourse, ResultsType.csv);
        const executeRScript = new ExecuteRScript("csv_test.Rmd");

        let steps: SchedulerStep[] = [getStudentsTestResults, executeRScript];

        let nextInput = "";
        for (let step of steps) {
            nextInput = await step.execute(nextInput);
        }

        return "Test executed successfully";
    }
}
