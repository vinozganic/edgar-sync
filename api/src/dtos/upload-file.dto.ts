import { ScriptType } from "src/enums/enum.script-type";

export class UploadFileDto {
    base64File: string;
    fileName: string;
    scriptType: ScriptType;
}
