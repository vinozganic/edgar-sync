import { MinioProvider } from "src/pipeline-logic/pipeline-providers/minio.provider";

export const decodeAndUploadGz = async (decodeAndUploadGz: any[]): Promise<Buffer> => {
    const searchString = `print(base64encode('source.tar.gz'));\n[1] "`;
    const base64Start = decodeAndUploadGz[0].output.indexOf(searchString) + searchString.length;
    const base64End = decodeAndUploadGz[0].output.indexOf(`"\n>`, base64Start);
    const base64String = decodeAndUploadGz[0].output.substring(base64Start, base64End);

    // Decode the base64 string to a buffer
    const decodedBase64 = Buffer.from(base64String, "base64");

    // Upload the application.gz file to Minio
    const resultBucket = "edgar-results";
    const resultProvider = new MinioProvider(resultBucket);

    const files = await resultProvider.listFiles();
    const fileName = `application${files.length + 1}.gz`;
    await resultProvider.uploadBuffer(fileName, decodedBase64, "application/gzip");

    return decodedBase64;
};
