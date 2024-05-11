import { MinioProvider } from "../providers/minio.provider";

export const decodeAndUploadZip = async (j0TextResponse: any[]): Promise<Buffer> => {
    const searchString = `print(base64encode('source.zip'));\n[1] "`;
    const base64Start = j0TextResponse[0].output.indexOf(searchString) + searchString.length;
    const base64End = j0TextResponse[0].output.indexOf(`"\n>`, base64Start);
    const base64String = j0TextResponse[0].output.substring(base64Start, base64End);

    // Decode the base64 string to a buffer
    const decodedBase64 = Buffer.from(base64String, "base64");

    // Upload the application.zip file to Minio
    const resultBucket = "edgar-bucket-r-results";
    const resultProvider = new MinioProvider(resultBucket);

    const files = await resultProvider.listFiles();
    const fileName = `application${files.length + 1}.zip`;
    await resultProvider.uploadBuffer(fileName, decodedBase64, "application/zip");

    return decodedBase64;
}