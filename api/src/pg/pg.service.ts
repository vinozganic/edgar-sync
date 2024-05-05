import { Injectable, Inject } from "@nestjs/common";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { MinioService } from "src/minio/minio.service";
import { config } from "dotenv";
import { PG_CONNECTION } from "src/constants";

config();

@Injectable()
export class SqlService {
    constructor(
        @Inject(PG_CONNECTION) private db: Kysely<DB>,
        private readonly minioService: MinioService
    ) {}

    async getStudentsTestResults(idTest, idCourse) {
        // idTest: 11810 | idCourse: 155
        const res = await this.db
            .selectFrom("student")
            .innerJoin("test_instance", "student.id", "test_instance.id_student")
            .innerJoin("test", "test_instance.id_test", "test.id")
            .where("test.id", "=", idTest)
            .where("test.id_course", "=", idCourse)
            .selectAll()
            .execute();

        const buffer = Buffer.from(JSON.stringify(res));
        const objectName = `test-results-${idTest}-${idCourse}.json`;

        await this.minioService.uploadBuffer(objectName, buffer, "application/json");

        console.log(res)
        return res;
    }

    async getStudentsOnCourse(idCourse: number, idAcademicYear: number) {
        // idAcademicYear: 2016 | idCourse: 155
        const res = await this.db
            .selectFrom("student")
            .innerJoin("student_course", "student.id", "student_course.id_student")
            .innerJoin("course", "student_course.id_course", "course.id")
            .where("student_course.id_course", "=", idCourse)
            .where("student_course.id_academic_year", "=", idAcademicYear)
            .selectAll("student")
            .execute();

        console.log(res)

        const buffer = Buffer.from(JSON.stringify(res));
        const objectName = `students-on-course-${idCourse}-${idAcademicYear}.json`;

        await this.minioService.uploadBuffer(objectName, buffer, "application/json");

        return res;
    }
}
