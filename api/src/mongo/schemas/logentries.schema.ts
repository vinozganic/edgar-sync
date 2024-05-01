import { Schema, model } from "mongoose";

const LogEntriesSchema = new Schema({
    _id: String,
    logConfig: {
        label: String,
        type: String,
        path: String,
        _id: String,
    },
    hostname: String,
    ts_collector: Date,
    appInstance: Number,
    ts_log: Date,
    script: String,
    level: String,
    message: String,
    __v: Number,
});

export const LogEntriesModel = model("LogEntries", LogEntriesSchema);
