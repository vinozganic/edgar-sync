// pg.service.ts
import { Injectable, Inject } from "@nestjs/common";
import { Kysely } from "kysely";
import { MinioService } from "src/minio/minio.service";
import { config } from "dotenv";
import { PG_CONNECTION, PG_SYNC_CONNECTION } from "src/constants";
import { EdgarDB } from "src/types/edgar_db";
import { EdgarSyncDB } from "src/types/edgar_sync_db";

config();

@Injectable()
export class SqlService {
    constructor(
        @Inject(PG_CONNECTION) private edgarDb: Kysely<EdgarDB>,
        @Inject(PG_SYNC_CONNECTION) private edgarSyncDb: Kysely<EdgarSyncDB>,
        private readonly minioService: MinioService
    ) {}

    async getStudentsTestResults(idTest, idCourse) {
        const res = await this.edgarDb
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

        console.log(res);
        return res;
    }

    async getStudentsOnCourse(idCourse: number, idAcademicYear: number) {
        const res = await this.edgarDb
            .selectFrom("student")
            .innerJoin("student_course", "student.id", "student_course.id_student")
            .innerJoin("course", "student_course.id_course", "course.id")
            .where("student_course.id_course", "=", idCourse)
            .where("student_course.id_academic_year", "=", idAcademicYear)
            .selectAll("student")
            .execute();

        console.log(res);

        const buffer = Buffer.from(JSON.stringify(res));
        const objectName = `students-on-course-${idCourse}-${idAcademicYear}.json`;

        await this.minioService.uploadBuffer(objectName, buffer, "application/json");

        return res;
    }

    // TODO: Add methods for getting data from edgar-sync database
}
