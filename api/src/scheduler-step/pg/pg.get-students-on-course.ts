import { MinioProvider } from "../providers/minio.provider";
import { db } from "../providers/pg.provider";
import { SchedulerStep } from "../scheduler-step.interface";

export class PgGetStudentsOnCourse implements SchedulerStep {
    private readonly idCourse: number;
    private readonly idAcademicYear: number;

    constructor(idCourse: number, idAcademicYear: number) {
        this.idCourse = idCourse;
        this.idAcademicYear = idAcademicYear;
    }

    async execute(nextInput?: string): Promise<string> {
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

        return `${location}/${objectName}`;
    }
}