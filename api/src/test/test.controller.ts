import { Controller, Get, Query } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { TestService } from "./test.service";

@Controller()
export class TestController {
    constructor(private testService: TestService) {}

    @Get("test")
    @ApiQuery({ name: "idTest", required: true, type: Number})
    @ApiQuery({ name: "idCourse", required: true, type: Number})
    async executeTest(@Query("idTest") idTest: number, @Query("idCourse") idCourse: number) {
        return this.testService.executeTest(idTest, idCourse);
    }
}
