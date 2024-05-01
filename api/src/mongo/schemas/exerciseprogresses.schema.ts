import { Schema, model } from "mongoose";

const ExerciseProgressesSchema = new Schema({
    _id: String,
    exerciseId: Number,
    studentId: Number,
    __v: Number,
    currentAnswers: [[]],
    events: [
        {
            eventName: String,
            eventData: String,
            clientTs: Date,
            ip: String,
            mongoTs: Date,
        },
    ],
    latestQuestionOrdinal: Number,
    startedTs: Date,
});

export const ExerciseProgressesModel = model("ExerciseProgresses", ExerciseProgressesSchema);
