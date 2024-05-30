import { MinioProvider } from "src/pipeline-logic/pipeline-providers/minio.provider";

export async function createPipelineFolder(cronJobUuid: string): Promise<string> {
    const bucketName = "edgar-pipelines";
    const minioProvider = new MinioProvider(bucketName);

    const timestamp = new Date().toISOString().slice(0, 16).replace("T", "_");
    const newFolderName = `${cronJobUuid}/${timestamp}`;

    await minioProvider.createFolderWithSubfolders(bucketName, newFolderName);

    return newFolderName;
}
