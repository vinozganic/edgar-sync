import axios from "axios";
import { MinioProvider } from "../providers/minio.provider";
import { SchedulerStep } from "../scheduler-step.interface";
import { genericInput } from "./r.generic-input";
import { zipAndEncodeData } from "../helpers/helper.zip-and-encode";
import { DbResultsType } from "../enums/enum.db-results-type";
import { decodeAndUploadZip } from "../helpers/helper.decode-and-upload-zip";
import { extractAndUploadHtml } from "../helpers/helper.extract-and-upload-html";
import { ScriptType } from "../enums/enum.script-type";
import { ScriptResultsType } from "../enums/enum.script-results-type";
import { extractAndUploadCsvJson } from "../helpers/helper.extract-and-upload-csv-json";

export class ExecuteRScript implements SchedulerStep {
    private readonly scriptName: string;
    private readonly scriptType: ScriptType;
    private readonly dbResultsType: DbResultsType;
    private readonly scriptResultsType: ScriptResultsType;

    constructor(
        scriptName: string,
        scriptType: ScriptType,
        dbResultsType: DbResultsType,
        scriptResultsType: ScriptResultsType
    ) {
        this.scriptName = scriptName;
        this.scriptType = scriptType;
        this.dbResultsType = dbResultsType;
        this.scriptResultsType = scriptResultsType;
    }

    async execute(nextInput?: string): Promise<string> {
        const scriptLocation = "edgar-bucket-r";
        const scriptProvider = new MinioProvider(scriptLocation);
        const scriptText = await scriptProvider.readFile(this.scriptName);

        const dataLocation = nextInput.split("/").slice(0, -1).join("/");
        const dataFileName = nextInput.split("/").slice(-1)[0];

        const dataProvider = new MinioProvider(dataLocation);
        const dataText = await dataProvider.readFile(dataFileName);

        const base64Data = await zipAndEncodeData(dataText, dataFileName);

        // IMPORTANT: file that script reads from should be called file.json or file.csv
        const fileToReplace = this.dbResultsType === DbResultsType.json ? "file.json" : "file.csv";
        const scriptWithCorrectInput = scriptText.toString().replace(new RegExp(fileToReplace, "g"), `${dataFileName}`);

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
        if (status.id != 14) return "Error in CodeRunner execution";

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
        if (this.scriptResultsType === ScriptResultsType.csv || this.scriptResultsType === ScriptResultsType.json) {
            extractAndUploadCsvJson(zipBuffer, this.scriptResultsType)
        } else if (this.scriptResultsType === ScriptResultsType.html) {
            extractAndUploadHtml(zipBuffer);
        } else {
            throw new Error("Invalid script type");
        }

        return `${scriptLocation}/${this.scriptName}`;
    }
}
