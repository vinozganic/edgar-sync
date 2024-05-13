import { api } from "src/boot/axios";
import { ScriptType } from "src/enums/ScriptType";

export const uploadFile = async (base64File: string, fileName: string, scriptType: ScriptType) => {
    const response = await api.post("/pipeline/uploadFile", {
        base64File: base64File,
        fileName: fileName,
        scriptType: scriptType,
    });
    return response.data;
};

export const setPipeline = async (steps: Array<{ name: string; args: any[] }>) => {
    const response = await api.post("/pipeline", {
        steps: steps,
    });
    return response.data;
}
