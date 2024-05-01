import { Schema, model } from "mongoose";

const SessionsSchema = new Schema({
    _id: Number,
    expires: Date,
    session: {
        type: Object,
    },
});

export const SessionsModel = model("Sessions", SessionsSchema);
