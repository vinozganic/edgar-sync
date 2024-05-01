import { Schema, model } from "mongoose";

export const TutorialProgressesSchema = new Schema({
    _id: String,
    courseId: Number,
    studentId: Number,
    tutorialId: Number,
    __v: Number,
    currentAnswers: [[]],
    events: [
        {
            eventName: String,
            eventData: String,
            clientTs: Date,
            retry: Number,
            ip: String,
            mongoTs: Date,
        },
    ],
    latestStepOrdinal: Number,
    startedTs: Date,
});

export const TutorialProgressesModel = model("TutorialProgresses", TutorialProgressesSchema);
