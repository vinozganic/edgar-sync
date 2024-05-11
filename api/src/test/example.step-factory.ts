// import { Injectable } from "@nestjs/common";
// import { ExecuteRScript } from "src/scheduler-step/R/r.execute-script";
// import { PgGetStudentTestResults } from "src/scheduler-step/pg/pg.get-student-test-results";
// import { SchedulerStep } from "src/scheduler-step/scheduler-step.interface";

// class SchedulerStepFactory {
//     static createStep(stepType: string, ...args: any[]): SchedulerStep {
//         switch(stepType) {
//             case 'PgGetStudentTestResults':
//                 return new PgGetStudentTestResults(...args);
//             case 'ExecuteRScript':
//                 return new ExecuteRScript(...args);
//             default:
//                 throw new Error(`Invalid step type: ${stepType}`);
//         }
//     }
// }

// @Injectable()
// export class TestService {
//     constructor() {}

//     async executeTest(idTest: number, idCourse: number, stepsData: {stepType: string, args: any[]}[]) {
//         let steps: SchedulerStep[] = stepsData.map(data => SchedulerStepFactory.createStep(data.stepType, ...data.args));

//         let nextInput = "";
//         for (let step of steps) {
//             nextInput = await step.execute(nextInput);
//         }

//         return "Test executed successfully";
//     }
// }

// //////////////////////

// async executeTest(idTest: number, idCourse: number, stepsData: {stepType: string, args: any}[]) {
//     let steps: SchedulerStep[] = stepsData.map(data => SchedulerStepFactory.createStep(data.stepType, ...data.args));

//     let nextInput = "";
//     for (let step of steps) {
//         nextInput = await step.execute(nextInput);
//     }

//     return "Test executed successfully";
// }
