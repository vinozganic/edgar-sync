import * as archiver from "archiver";

export const zipAndEncodeData = async (dataText: string, dataFileName: string): Promise<string> => {
    const archive = archiver("zip", {
        zlib: { level: 9 }, // set compression level
    });

    // append the data to the archive as a file
    archive.append(dataText, { name: dataFileName });

    // convert the archive to a buffer
    const zipBuffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        archive.on("data", chunk => chunks.push(chunk));
        archive.on("error", reject);
        archive.on("end", () => resolve(Buffer.concat(chunks)));
        archive.finalize();
    });

    const base64Data = zipBuffer.toString("base64");

    return base64Data;
};
