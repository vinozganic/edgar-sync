import { ScheduledJobDto } from "./scheduled-job.dto";

export class FinishedScheduledJobDto {
    job: ScheduledJobDto | { uuid: string };
    timestamp: string;
    location: string;
    isInDatabase: boolean;
}
