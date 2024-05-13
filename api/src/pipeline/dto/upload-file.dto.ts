import { ScriptType } from "src/pipeline-step/enums/enum.script-type";

export class UploadFileDto {
    base64File: string;
    fileName: string;
    scriptType: ScriptType;
}