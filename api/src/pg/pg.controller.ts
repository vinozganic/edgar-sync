import { Controller, Get, Query } from "@nestjs/common";
import { SqlService } from "./pg.service";
import { ApiQuery } from "@nestjs/swagger";

@Controller()
export class SqlController {
    constructor(private sqlService: SqlService) {}

    @Get("students-test-results")
    @ApiQuery({ name: "idTest", required: true, type: Number})
    @ApiQuery({ name: "idCourse", required: true, type: Number})
    getStudentsTestResults(@Query("idTest") idTest: number, @Query("idCourse") idCourse: number) {
        return this.sqlService.getStudentsTestResults(idTest, idCourse);
    }

    @Get("students-on-course")
    @ApiQuery({ name: "idCourse", required: true, type: Number })
    @ApiQuery({ name: "idAcademicYear", required: true, type: Number})
    getStudentsOnCourse(@Query("idCourse") idCourse: number, @Query("idAcademicYear") idAcademicYear: number) {
        return this.sqlService.getStudentsOnCourse(idCourse, idAcademicYear);
    }
}
