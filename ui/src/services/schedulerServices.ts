import { api } from "src/boot/axios";

export const createScheduledJob = async (
    name: string,
    steps: Array<{ name: string; args: Array<string | number> }>,
    cronJob: string,
    email?: string
) => {
    const response = await api.post("/scheduler/create-scheduled-job", {
        name: name,
        steps: steps,
        cronJob: cronJob,
        email: email,
    });
    return response.data;
};

export const getAllScheduledJobs = async () => {
    const response = await api.get("/scheduler/get-all-scheduled-jobs");
    return response.data;
};

export const deleteScheduledJob = async (uuid: string) => {
    const response = await api.delete("/scheduler/delete-scheduled-job", {
        params: { uuid },
    });
    return response.data;
};

export const updateScheduledJob = async (
    uuid: string,
    name: string,
    steps: Array<{ name: string; args: Array<string | number> }>,
    cronJob: string,
    email?: string
) => {
    const response = await api.patch(`/scheduler/update-scheduled-job?uuid=${encodeURIComponent(uuid)}`, {
        name,
        steps,
        cronJob,
        email,
    });
    return response.data;
};
