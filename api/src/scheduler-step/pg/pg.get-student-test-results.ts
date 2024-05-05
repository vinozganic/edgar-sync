import { MinioProvider } from "../providers/minio.provider";
import { db } from "../providers/pg.provider";
import { SchedulerStep } from "../scheduler-step.interface";

export class PgGetStudentTestResults implements SchedulerStep {
    private readonly idTest: number;
    private readonly idCourse: number;

    constructor(idTest: number, idCourse: number) {
        this.idTest = idTest;
        this.idCourse = idCourse;
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

        const buffer = Buffer.from(JSON.stringify(res));
        const objectName = `test-results-${this.idTest}-${this.idCourse}.json`;

        const location = "edgar-bucket-pg";
        const provider = new MinioProvider(location);
        await provider.uploadBuffer(objectName, buffer, "application/json");

        return `${location}/${objectName}`;
    }
}
