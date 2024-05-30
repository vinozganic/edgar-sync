export const decodeZip = async (j0TextResponse: any[]): Promise<Buffer> => {
    const searchString = `print(base64encode('source.zip'));\n[1] "`;
    const base64Start = j0TextResponse[0].output.indexOf(searchString) + searchString.length;
    const base64End = j0TextResponse[0].output.indexOf(`"\n>`, base64Start);
    const base64String = j0TextResponse[0].output.substring(base64Start, base64End);

    // Decode the base64 string to a buffer
    return Buffer.from(base64String, "base64");
};
