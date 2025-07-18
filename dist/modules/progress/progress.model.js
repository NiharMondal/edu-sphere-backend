"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const mongoose_1 = require("mongoose");
const progressSchema = new mongoose_1.Schema({
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Student ID is required"],
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course ID is required"],
    },
    progress: {
        type: Number,
        default: 0, // in percentage
    },
    lastWatchedLecture: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Lecture",
        default: null,
    },
    completedLectures: [String],
});
exports.Progress = (0, mongoose_1.model)("Progress", progressSchema);
