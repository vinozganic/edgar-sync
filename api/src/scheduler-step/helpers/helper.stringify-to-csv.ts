import { stringify } from "csv";

export const stringifyToCSV = (data, options) => {
    return new Promise<string>((resolve, reject) => {
        stringify(data, options, (err, output) => {
            if (err) {
                reject(err);
            } else {
                resolve(output);
            }
        });
    });
};
