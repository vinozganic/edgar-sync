export class ScheduledJobDto {
    id: number;
    uuid: string;
    name: string;
    steps: any[];
    cronJob: string;
    email?: string;
    created?: Date;
    lastModified?: Date;
}
