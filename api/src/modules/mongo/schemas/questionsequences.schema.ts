import { Schema, model } from "mongoose";

const QuestionSequencesSchema = new Schema({
    _id: String,
    created: String,
    sequence: [Number],
    expireTs: Date,
    __v: Number,
});

export const QuestionSequencesModel = model("QuestionSequences", QuestionSequencesSchema);
