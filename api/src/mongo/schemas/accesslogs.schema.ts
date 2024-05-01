import { Schema, model } from "mongoose";

const AccessLogsSchema = new Schema({
    _id: String,
    user: String,
    instance: String,
    method: String,
    url: String,
    statusCode: String,
    ip: String,
    ts: Date,
    responseTime: Number,
    userAgent: String,
    __v: Number,
});

export const AccessLogsModel = model("AccessLogs", AccessLogsSchema);
