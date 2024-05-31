import { MinioProvider } from "src/pipeline-logic/pipeline-providers/minio.provider";

export class PipelineLogger {
    private logIdentifier: string; // cron job uuid OR some simple identifier
    private timestamp: string;
    private minioProvider: MinioProvider;

    constructor(logIdentifier: string, excludeTimestamp?: boolean) {
        this.logIdentifier = logIdentifier;
        this.minioProvider = new MinioProvider("edgar-logs");
        this.timestamp = excludeTimestamp ? "" : new Date().toISOString().slice(0, 16).replace("T", "_");
    }

    static withoutTimestamp(logIdentifier: string) {
        return new PipelineLogger(logIdentifier, true);
    }

    public async writeLog(logHeader: string, logLocation: string, logMessage: string) {
        const fullLogName =
            this.timestamp === ""
                ? `${this.logIdentifier}.log`
                : `job-logs/${this.logIdentifier}/${this.timestamp}.log`;
        const logTimestamp = new Date().toISOString().slice(0, 19).replace("T", "_");

        try {
            const oldLogText = await this.minioProvider.readFile(fullLogName);
            const newLogText = oldLogText + `\n${logTimestamp} [${logHeader}] - ${logLocation}: ${logMessage}`;
            await this.minioProvider.uploadBuffer(fullLogName, Buffer.from(newLogText), "text/plain");
        } catch (error) {
            const newLogText = `${logTimestamp} [${logHeader}] - ${logLocation}: ${logMessage}`;
            await this.minioProvider.uploadBuffer(fullLogName, Buffer.from(newLogText), "text/plain");
        }

        console.log(`${logTimestamp} [${logHeader}] - ${logLocation}: ${logMessage}`);
    }

    public async getLog(): Promise<string> {
        const fullLogName =
            this.timestamp === ""
                ? `${this.logIdentifier}.log`
                : `job-logs/${this.logIdentifier}/${this.timestamp}.log`;

        return await this.minioProvider.readFile(fullLogName);
    }
}
