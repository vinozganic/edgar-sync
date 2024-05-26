import * as fs from "fs";
import * as path from "path";
import * as unzipper from "unzipper";
import * as fsp from "fs/promises";
import { MinioProvider } from "../providers/minio.provider";
import { ScriptResultsType } from "../enums/enum.script-results-type";
import { TransferObject } from "../dto/dto.transfer-object";
import { getFileNameWithTimestamp } from "./helper.get-file-name-with-timestamp";
import { StepType } from "../enums/enum.step-type";

export const extractAndUploadFile = async (
    location: string,
    zipBuffer: Buffer,
    scriptResultsType: ScriptResultsType
): Promise<TransferObject> => {
    const scriptResultsTypeExtension =
        scriptResultsType === ScriptResultsType.csv ? "csv_" : ScriptResultsType.json ? "json_" : "html_";
    const finalFileName =
        scriptResultsType === ScriptResultsType.csv
            ? "file_modified.csv"
            : ScriptResultsType.json
              ? "file_modified.json"
              : "script.html";
    const fileNameWithTimestamp = getFileNameWithTimestamp(finalFileName);
    const fullFileName = `${location}/results/${fileNameWithTimestamp}`;

    const tmpDir = await fsp.mkdtemp(
        `C:/Users/Jakov/Desktop/quasar-nest-runner/edgar-sync/api/tmp/${scriptResultsTypeExtension}`
    );
    const zipPath = path.join(tmpDir, "temp.zip");
    await fsp.writeFile(zipPath, zipBuffer);

    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(zipPath)
                .pipe(unzipper.Extract({ path: tmpDir }))
                .on("error", reject)
                .on("close", resolve);
        });
    } catch (error) {
        console.error("An error occurred:", error);
    }
    const scriptResults = await fsp.readFile(path.join(tmpDir, "files", finalFileName), "utf8");

    const minioProvider = new MinioProvider("edgar-pipelines");
    const bufferFileType =
        scriptResultsType === ScriptResultsType.csv
            ? "text/csv"
            : ScriptResultsType.json
              ? "application/json"
              : "text/html";

    await minioProvider.uploadBuffer(fullFileName, Buffer.from(scriptResults), bufferFileType);

    return {
        location: location,
        objectName: fileNameWithTimestamp,
        lastStepType: StepType.rScriptResult,
    } as TransferObject;
};
