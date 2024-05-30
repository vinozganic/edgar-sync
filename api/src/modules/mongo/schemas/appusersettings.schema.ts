import { Schema, model } from "mongoose";

const AppUserSettingsSchema = new Schema({
    _id: String,
    markWhitespace: Boolean,
    showQuestionHeader: Boolean,
    username: String,
    currAcademicYearId: Number,
    currCourseId: Number,
    cmSkin: String,
    __v: Number,
});

export const AppUserSettingsModel = model("AppUserSettings", AppUserSettingsSchema);
