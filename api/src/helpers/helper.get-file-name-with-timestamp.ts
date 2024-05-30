export const getFileNameWithTimestamp = (fileName: string): string => {
    const lastPeriodIndex = fileName.lastIndexOf(".");

    const fileNameWithoutExtension = lastPeriodIndex === -1 ? fileName : fileName.slice(0, lastPeriodIndex);
    const fileExtension = lastPeriodIndex === -1 ? "" : fileName.slice(lastPeriodIndex);
    const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\..+/, "");

    return `${fileNameWithoutExtension}-${timestamp}${fileExtension}`;
};
