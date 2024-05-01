import { Schema, model } from "mongoose";

const HeartbeatsSchema = new Schema({
    _id: String,
    __v: Number,
    beats: [
        {
            ts: Date,
            ip: String,
        },
    ],
    expireTs: Date,
    fullname: String,
    id_test: Number,
    progress: Number,
    username: String,
});

export const HeartbeatsModel = model("Heartbeats", HeartbeatsSchema);
