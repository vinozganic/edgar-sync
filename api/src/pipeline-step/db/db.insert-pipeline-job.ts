import { edgarSyncDb } from "../providers/pg.provider";

interface PipelineJob {
    name: string;
    steps: object;
    cronjob: string;
}

export const insertPipelineJob = async (pipelineJob: PipelineJob): Promise<string> => {
    const stepsJson = JSON.stringify(pipelineJob.steps);

    const [createdJob] = await edgarSyncDb
        .insertInto("pipelines")
        .values({
            name: pipelineJob.name,
            steps: stepsJson,
            cronjob: pipelineJob.cronjob,
        })
        .returning("id")
        .execute();

    return createdJob.id;
};
