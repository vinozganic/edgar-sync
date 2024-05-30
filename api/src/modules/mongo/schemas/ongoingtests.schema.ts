import { Schema, model } from "mongoose";

const OngoingTestsSchema = new Schema({
    _id: String,
    __v: Number,
    currTestProperties: {
        type: Object,
    },
    currAnswers: {
        type: Object,
    },
});

export const OngoingTestsModel = model("OngoingTests", OngoingTestsSchema);
