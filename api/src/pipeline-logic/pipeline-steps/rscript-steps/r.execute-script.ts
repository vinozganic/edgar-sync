import axios from "axios";
import { PipelineStep } from "../generic-steps/pipeline-step.interface";
import { zipAndEncodeData } from "../../../helpers/helper.zip-and-encode";
import { DbResultsType } from "../../../enums/enum.db-results-type";
import { ScriptType } from "../../../enums/enum.script-type";
import { ScriptResultsType } from "../../../enums/enum.script-results-type";
import { extractAndUploadFile } from "../../../helpers/helper.extract-and-upload-file";
import { TransferObject } from "../../../dtos/dto.transfer-object";
import { renameDataFile } from "../../../helpers/helper.rename-data-file";
import { decodeZip } from "../../../helpers/helper.decode-zip";
import { StepType } from "src/enums/enum.step-type";
import { MinioProvider } from "src/pipeline-logic/pipeline-providers/minio.provider";
import { PipelineLogger } from "src/pipeline-logger/pipeline-logger";

export class ExecuteRScript implements PipelineStep {
    private readonly scriptName: string;
    private readonly scriptType: ScriptType;
    private readonly dbResultsType: DbResultsType;
    private readonly scriptResultsType: ScriptResultsType;

    constructor(...args: any[]) {
        [this.scriptName, this.scriptType, this.dbResultsType, this.scriptResultsType] = args;
    }

    async execute(transferObject?: TransferObject): Promise<TransferObject> {
        const pipelineLogger = transferObject?.pipelineLogger;

        try {
            const scriptLocation = "edgar-scripts";
            const scriptProvider = new MinioProvider(scriptLocation);
            const scriptText = await scriptProvider.readFile(this.scriptName);
            const scriptBuffer = await scriptProvider.readBuffer(this.scriptName);

            await pipelineLogger.writeLog("INFO", "ExecuteRScript", `Script ${this.scriptName} read from Minio`);

            // get full path to data file
            const stepTypeToFolderName = {
                [StepType.dbRecordset]: "db-recordsets",
                [StepType.rScriptResult]: "results",
            };
            const dataFolderName = stepTypeToFolderName[transferObject.lastStepType];
            if (!dataFolderName) throw new Error("Invalid last step type");
            const fullDataFileName = `${transferObject.location}/${dataFolderName}/${transferObject.objectName}`;

            // data from query or previous script
            const dataProvider = new MinioProvider("edgar-pipelines");
            const dataText = await dataProvider.readFile(fullDataFileName);

            await pipelineLogger.writeLog("INFO", "ExecuteRScript", `Data file ${fullDataFileName} read from Minio`);

            // copy the script to minio folder of current pipeline
            const scriptToCopyName = `${transferObject.location}/scripts/${this.scriptName}`;
            await dataProvider.uploadBuffer(scriptToCopyName, scriptBuffer, "text/plain");

            await pipelineLogger.writeLog("INFO", "ExecuteRScript", `Script copied to ${scriptToCopyName}`);

            // rename the data file so the j0 doesn't have the same file name for input and output
            const dataFileRenamed = renameDataFile(fullDataFileName, this.dbResultsType);

            const base64Data = await zipAndEncodeData(dataText, dataFileRenamed);

            await pipelineLogger.writeLog("INFO", "ExecuteRScript", `Data file ${dataFileRenamed} zipped and encoded`);

            // IMPORTANT: file that script reads from should be called file.json or file.csv
            const fileToReplace = this.dbResultsType === DbResultsType.json ? "file.json" : "file.csv";
            const scriptWithCorrectInput = scriptText
                .toString()
                .replace(new RegExp(fileToReplace, "g"), `${dataFileRenamed}`);

            const requestObject = {
                inputs: [{ input: "1", id: 0 }],
                source: scriptWithCorrectInput,
                language_id: this.scriptType === ScriptType.r ? 92 : 93,
                additional_files: base64Data,
            };

            await pipelineLogger.writeLog("INFO", "ExecuteRScript", `Request object created for CodeRunner`);

            // send the request to CodeRunner
            const response = await axios.post("http://localhost:10084/run", requestObject);
            const status = response.data.status;
            const results = response.data.results;
            if (status.id != 14) throw new Error("Error running script");

            await pipelineLogger.writeLog("INFO", "ExecuteRScript", `Script executed with status ID ${status.id}`);

            const j0TextResponse = [];
            results.forEach(result => {
                const decodedOutput = Buffer.from(result.stdout.trim(), "base64").toString("ascii");

                j0TextResponse.push({
                    output: decodedOutput,
                });
            });

            // decode the base64 string to a buffer
            const zipBuffer = await decodeZip(j0TextResponse);

            await pipelineLogger.writeLog("INFO", "ExecuteRScript", `Zip buffer decoded`);

            // extract the zip file and upload the script to Minio
            const updatedTransferObject = await extractAndUploadFile(
                transferObject.location,
                zipBuffer,
                this.scriptResultsType,
                transferObject
            );

            await pipelineLogger.writeLog(
                "SUCCESS",
                "ExecuteRScript",
                `Successfully executed script and uploaded results`
            );

            return updatedTransferObject;
        } catch (e) {
            await pipelineLogger.writeLog(
                "ERROR",
                "ExecuteRScript",
                `Error while executing R script step: ${e.message}`
            );
            throw e;
        }
    }
}
