import { Controller, Get, Query } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { MongoService } from "./mongo.service";

@Controller()
export class MongoController {
    constructor(private mongoService: MongoService) {}

    @Get("testlogdetails")
    @ApiQuery({ name: "idTestInstance", required: true, type: String })
    async getTestLogDetails(@Query("idTestInstance") idTestInstance: string) {
        return this.mongoService.getTestLogDetails(idTestInstance);
    }
}
