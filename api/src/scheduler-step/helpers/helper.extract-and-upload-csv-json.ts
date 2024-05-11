import * as fs from "fs";
import * as path from "path";
import * as unzipper from "unzipper";
import * as fsp from "fs/promises";
import { MinioProvider } from "../providers/minio.provider";
import { ScriptResultsType } from "../enums/enum.script-results-type";

export const extractAndUploadCsvJson = async (zipBuffer: Buffer, scriptResultsType: ScriptResultsType) => {
    const scriptResultsTypeExtension = scriptResultsType === ScriptResultsType.csv ? "csv_" : "json_";
    const finalFileName = scriptResultsType === ScriptResultsType.csv ? "file_modified.csv" : "file_modified.json";

    const tmpDir = await fsp.mkdtemp(
        `C:/Users/Jakov/Desktop/quasar-nest-runner/edgar-sync/api/tmp/${scriptResultsTypeExtension}`
    );
    const zipPath = path.join(tmpDir, "temp1.zip");
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

    const minioProvider = new MinioProvider("edgar-bucket-r-results");
    const bufferFileType = scriptResultsType === ScriptResultsType.csv ? "text/csv" : "application/json";
    await minioProvider.uploadBuffer(finalFileName, Buffer.from(scriptResults), bufferFileType);

    // implementiraj vracanje lokacije i imena fajla
};
