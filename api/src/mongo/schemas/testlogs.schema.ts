import { Schema, model } from "mongoose";

const TestLogsSchema = new Schema({
    _id: Number,
    __v: Number,
    events: [
        {
            eventName: String,
            eventData: String,
            clientTs: Date,
            mongoTs: Date,
            username: String,
            fullname: String,
        },
    ],
});

export const TestLogsModel = model("TestLogs", TestLogsSchema);