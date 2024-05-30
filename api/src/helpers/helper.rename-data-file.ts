import { DbResultsType } from "../enums/enum.db-results-type";

export const renameDataFile = (dataFileName: string, dbResultType: DbResultsType): string => {
    const extension = dbResultType === DbResultsType.csv ? ".csv" : ".json";
    const index = dataFileName.indexOf(extension);
    const dataFileRenamed = dataFileName.substring(0, index) + "_new" + extension;

    return dataFileRenamed;
};
