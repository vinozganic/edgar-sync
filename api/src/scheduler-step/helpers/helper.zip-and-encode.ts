import * as fs from "fs";
import * as fsp from "fs/promises";
import * as archiver from "archiver";

export const zipAndEncodeData = async (dataText: string, dataFileName: string): Promise<string> => {
    // write the data to a .json file
    await fsp.writeFile(dataFileName, dataText);

    const output = fs.createWriteStream(`${dataFileName}.zip`);
    const archive = archiver("zip", {
        zlib: { level: 9 }, // set compression level
    });

    archive.pipe(output);
    archive.file(dataFileName, { name: dataFileName });
    await new Promise((resolve, reject) => {
        archive.on("error", reject);
        archive.on("end", resolve);
        archive.finalize();
    });

    const zipBuffer = await fsp.readFile(`${dataFileName}.zip`);
    const base64Data = zipBuffer.toString("base64");

    return base64Data;
};
