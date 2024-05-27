export interface Step {
    name: string;
    args: (string | number)[];
}

export interface Job {
    name: string;
    steps: Step[];
    cronJob: string;
}

export interface ScheduledJob {
    id: number;
    uuid: string;
    name: string;
    steps: Step[];
    cronJob: string;
    created: string;
    lastModified: string;
}
