export interface Step {
    name: string;
    args: (string | number)[];
}

export interface Job {
    uuid: string;
    name: string;
    steps: Step[];
    cronJob: string;
    email?: string;
}

export interface ScheduledJob {
    id: number;
    uuid: string;
    name: string;
    steps: Step[];
    cronJob: string;
    email?: string;
    created: string;
    lastModified: string;
}
