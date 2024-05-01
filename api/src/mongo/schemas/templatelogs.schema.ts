import { Schema, model } from "mongoose";

const TemplateLogsSchema = new Schema({
    _id: Number,
    __v: Number,
    error: { type: String, required: false },
    log: String,
    success: Boolean,
    ts_modified: Date,
});

export const TemplateLogsModel = model("TemplateLogs", TemplateLogsSchema);
