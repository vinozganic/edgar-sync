import { Schema, model } from "mongoose";

const TestLogDetailsSchema = new Schema({
    _id: String,
    id_test_instance: Number,
    ordinal: Number,
    code: String,
    result: {
        success: Boolean,
        coderesult: String,
        score: {
            is_correct: Boolean,
            is_incorrect: Boolean,
            score: Number,
            score_perc: Number,
            hint: String,
        },
        runStats: [],
        mongoTs: Date,
    },
    __v: Number,
});

export const TestLogDetailsModel = model("TestLogDetails", TestLogDetailsSchema);
