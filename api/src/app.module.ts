import * as path from "path";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { PipelineModule } from "./modules/pipeline/pipeline.module";
import { MongoModule } from "./modules/mongo/mongo.module";
import { SchedulerModule } from "./modules/scheduler/scheduler.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { config } from "dotenv";

config();

@Module({
    imports: [
        PipelineModule,
        ScheduleModule.forRoot(),
        SchedulerModule,
        MongoModule,
        MailerModule.forRoot({
            transport: {
                host: process.env.MAILER_HOST,
                port: process.env.MAILER_PORT,
                secure: true,
                auth: {
                    user: process.env.MAILER_ADDRESS,
                    pass: process.env.MAILER_PASSWORD,
                },
            },
            defaults: {
                from: `'"EdgarSync" <${process.env.MAILER_ADDRESS}>'`,
            },
            template: {
                dir: `${process.cwd()}/templates/`,
                adapter: new EjsAdapter(),
                options: {
                    strict: false,
                },
            },
        }),
    ],
})
export class AppModule {}
