import { api } from "src/boot/axios";

export const createScheduledJob = async (
    steps: Array<{ name: string; args: Array<string | number> }>,
    cronJob: string
) => {
    const response = await api.post("/scheduler", {
        steps: steps,
        cronJob: cronJob,
    });
    return response.data;
};
