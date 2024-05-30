import { MinioProvider } from "src/pipeline-logic/pipeline-providers/minio.provider";

export async function createPipelineFolder(cronJobId: string): Promise<string> {
    const bucketName = "edgar-pipelines";
    const minioProvider = new MinioProvider(bucketName);

    const folders = await minioProvider.listFiles();
    const matchingFolders = folders.filter(folder => folder.startsWith(cronJobId) && folder.endsWith("/"));

    const count = matchingFolders.length > 0 ? Math.floor(matchingFolders.length / 3) : 0;
    const newFolderName = `${cronJobId}_${count + 1}`;

    await minioProvider.createFolderWithSubfolders(bucketName, newFolderName);

    return newFolderName;
}
