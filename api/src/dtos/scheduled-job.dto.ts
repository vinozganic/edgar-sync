export class ScheduledJobDto {
    id: number;
    uuid: string;
    name: string;
    steps: any[];
    cronJob: string;
    created?: Date;
    lastModified?: Date;
}
