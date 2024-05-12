import { Injectable } from "@nestjs/common";
import { ExecuteRScript } from "src/pipeline-step/R/r.execute-script";
import { TransferObject } from "src/pipeline-step/dto/dto.transfer-object";
import { PgGetStudentTestResults } from "src/pipeline-step/pg/pg.get-student-test-results";
import { PipelineStep } from "src/pipeline-step/pipeline-step.interface";
// import other classes here

@Injectable()
export class PipelineService {
    async executePipeline(steps: Array<{ name: string; args: any[] }>) {
        const stepInstances: PipelineStep[] = steps.map(step => {
            switch (step.name) {
                case "PgGetStudentTestResults":
                    return new PgGetStudentTestResults(...step.args);
                case "ExecuteRScript":
                    return new ExecuteRScript(...step.args);
                // add other cases here
                default:
                    throw new Error(`Invalid step name: ${step.name}`);
            }
        });

        let transferObject = {} as TransferObject;
        for (let step of stepInstances) {
            transferObject = await step.execute(transferObject);
        }

        return transferObject;
    }
}
