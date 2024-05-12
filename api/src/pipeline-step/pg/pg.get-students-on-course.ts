import { TransferObject } from "../dto/dto.transfer-object";
import { MinioProvider } from "../providers/minio.provider";
import { db } from "../providers/pg.provider";
import { PipelineStep } from "../pipeline-step.interface";

export class PgGetStudentsOnCourse implements PipelineStep {
    private readonly idCourse: number;
    private readonly idAcademicYear: number;

    constructor(...args: any[]) {
        [this.idCourse, this.idAcademicYear] = args;
    }

    async execute(transferObject?: TransferObject): Promise<TransferObject> {
        const res = await db
            .selectFrom("student")
            .innerJoin("student_course", "student.id", "student_course.id_student")
            .innerJoin("course", "student_course.id_course", "course.id")
            .where("student_course.id_course", "=", this.idCourse)
            .where("student_course.id_academic_year", "=", this.idAcademicYear)
            .selectAll("student")
            .execute();

        const buffer = Buffer.from(JSON.stringify(res));
        const objectName = `students-on-course-${this.idCourse}-${this.idAcademicYear}.json`;

        const location = "edgar-bucket/pg/";
        const provider = new MinioProvider(location);
        await provider.uploadBuffer(objectName, buffer, "application/json");

        return {
            location,
            objectName,
        } as TransferObject;
    }
}
