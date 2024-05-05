export interface SchedulerStep {
    execute(nextInput?: string): Promise<string>;
}
