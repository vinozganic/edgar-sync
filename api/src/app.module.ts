import * as path from "path";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { PipelineModule } from "./modules/pipeline/pipeline.module";
import { MongoModule } from "./modules/mongo/mongo.module";
import { SchedulerModule } from "./modules/scheduler/scheduler.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";

@Module({
    imports: [
        PipelineModule,
        ScheduleModule.forRoot(),
        SchedulerModule,
        MongoModule,
        MailerModule.forRoot({
            transport: {
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // use SSL
                auth: {
                    user: "edgarsync.notificator@gmail.com",
                    pass: "wcos ybym qftf tvor",
                },
            },
            defaults: {
                from: '"EdgarSync" <edgarsync.notificator@gmail.com>',
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
