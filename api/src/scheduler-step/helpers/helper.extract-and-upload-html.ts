import * as fs from "fs";
import * as path from "path";
import * as unzipper from "unzipper";
import * as fsp from "fs/promises";
import { MinioProvider } from "../providers/minio.provider";

export const extractAndUploadHtml = async (zipBuffer: Buffer) => {
    const tmpDir = await fsp.mkdtemp("C:/Users/Jakov/Desktop/quasar-nest-runner/edgar-sync/api/tmp/html_");

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
    const scriptHtml = await fsp.readFile(path.join(tmpDir, "files", "script.html"), "utf8");

    const minioProvider = new MinioProvider("edgar-bucket-r-results");
    await minioProvider.uploadBuffer("script.html", Buffer.from(scriptHtml), "text/html");

    // implementiraj vracanje lokacije i imena fajla
};
