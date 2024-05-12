import axios from "axios";
import { MinioProvider } from "../providers/minio.provider";
import { PipelineStep } from "../pipeline-step.interface";
import { genericInput } from "./r.generic-input";
import { zipAndEncodeData } from "../helpers/helper.zip-and-encode";
import { DbResultsType } from "../enums/enum.db-results-type";
import { decodeAndUploadZip } from "../helpers/helper.decode-and-upload-zip";
import { ScriptType } from "../enums/enum.script-type";
import { ScriptResultsType } from "../enums/enum.script-results-type";
import { extractAndUploadFile } from "../helpers/helper.extract-and-upload-file";
import { TransferObject } from "../dto/dto.transfer-object";
import { renameDataFile } from "../helpers/helper.rename-data-file";

export class ExecuteRScript implements PipelineStep {
    private readonly scriptName: string;
    private readonly scriptType: ScriptType;
    private readonly dbResultsType: DbResultsType;
    private readonly scriptResultsType: ScriptResultsType;

    constructor(...args: any[]) {
        [this.scriptName, this.scriptType, this.dbResultsType, this.scriptResultsType] = args;
    }

    async execute(transferObject?: TransferObject): Promise<TransferObject> {
        const scriptLocation = "edgar-bucket-r";
        const scriptProvider = new MinioProvider(scriptLocation);
        const scriptText = await scriptProvider.readFile(this.scriptName);

        const dataLocation = transferObject.location;
        const dataFileName = transferObject.objectName;

        const dataProvider = new MinioProvider(dataLocation);
        const dataText = await dataProvider.readFile(dataFileName);

        // rename the data file so the j0 doesn't have the same file name for input and output
        const dataFileRenamed = renameDataFile(dataFileName, this.dbResultsType);

        const base64Data = await zipAndEncodeData(dataText, dataFileRenamed);

        // IMPORTANT: file that script reads from should be called file.json or file.csv
        const fileToReplace = this.dbResultsType === DbResultsType.json ? "file.json" : "file.csv";
        const scriptWithCorrectInput = scriptText
            .toString()
            .replace(new RegExp(fileToReplace, "g"), `${dataFileRenamed}`);

        const requestObject = {
            inputs: genericInput,
            source: scriptWithCorrectInput,
            language_id: this.scriptType === ScriptType.r ? 92 : 93,
            additional_files: base64Data,
        };

        // send the request to CodeRunner
        const response = await axios.post("http://localhost:10084/run", requestObject);
        const status = response.data.status;
        const results = response.data.results;
        if (status.id != 14) throw new Error("Error running script");

        const j0TextResponse = [];
        results.forEach(result => {
            const decodedOutput = Buffer.from(result.stdout.trim(), "base64").toString("ascii");

            j0TextResponse.push({
                output: decodedOutput,
            });
        });

        // decode the base64 string to a buffer
        const zipBuffer = await decodeAndUploadZip(j0TextResponse);

        // extract the zip file and upload the script to Minio
        return extractAndUploadFile(zipBuffer, this.scriptResultsType);
    }
}
