import { Schema, model } from "mongoose";

const ScriptLogsSchema = new Schema({
    _id: Number,
    __v: Number,
    log: String,
    success: Boolean,
    ts_modified: Date,
});
