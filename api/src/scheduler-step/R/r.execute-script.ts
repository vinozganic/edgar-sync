import axios from "axios";
import { MinioProvider } from "../providers/minio.provider";
import { SchedulerStep } from "../scheduler-step.interface";
import { genericInput } from "./r.generic-input";
import { zipAndEncodeData } from "../helpers/helper.zip-and-encode";
import { decodeAndUploadGz } from "../helpers/helper.decode-and-upload-gz";

export class ExecuteRScript implements SchedulerStep {
    private readonly scriptName: string;

    constructor(scriptName: string) {
        this.scriptName = scriptName;
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

        const scriptWithCorrectInput = scriptText.toString().replace(/file.json/g, `${dataFileName}`);

        const requestObject = {
            inputs: genericInput,
            source: scriptWithCorrectInput,
            language_id: 91,
            additional_files: base64Data,
        };

        // send the request to CodeRunner
        const response = await axios.post("http://localhost:10084/run", requestObject);
        const status = response.data.status;
        const results = response.data.results;
        if (status.id != 14) return "error";

        const resultsToReturn = [];
        results.forEach(result => {
            const decodedOutput = Buffer.from(result.stdout.trim(), "base64").toString("ascii");

            resultsToReturn.push({
                output: decodedOutput,
            });
        });

        await decodeAndUploadGz(resultsToReturn);

        return `${scriptLocation}/${this.scriptName}`;
    }
}
