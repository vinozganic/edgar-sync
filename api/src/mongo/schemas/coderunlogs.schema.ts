import { Schema, model } from "mongoose";

const CodeRunLogsSchema = new Schema({
    _id: String,
    __v: Number,
    code_runs: [
        {
            ts: Date,
            username: String,
            id_student: Number,
            id_question: Number,
            ordinal: Number,
            code: String,
            score: Number,
            is_correct: Boolean,
        },
    ],
    id_question: Number,
    id_test: Number,
    ts_modified: Date,
});

export const CodeRunLogsModel = model("CodeRunLogs", CodeRunLogsSchema);
