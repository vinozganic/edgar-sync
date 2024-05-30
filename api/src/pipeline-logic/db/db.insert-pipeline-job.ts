import { edgarSyncDb } from "../providers/pg.provider";

interface PipelineJob {
    name: string;
    steps: object;
    cronjob: string;
}

export const insertPipelineJob = async (pipelineJob: PipelineJob): Promise<string> => {
    const stepsJson = JSON.stringify(pipelineJob.steps);

    const [createdJob] = await edgarSyncDb
        .insertInto("scheduledJobs")
        .values({
            name: pipelineJob.name,
            steps: stepsJson,
            cronJob: pipelineJob.cronjob,
        })
        .returning("uuid")
        .execute();

    return createdJob.uuid;
};
