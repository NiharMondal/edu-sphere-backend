"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lecture = void 0;
const mongoose_1 = require("mongoose");
const lectureSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Lecture title is required"],
        unique: true,
    },
    type: {
        type: String,
        enum: ["video", "post"],
        required: [true, "File type is required"],
    },
    content: {
        type: String,
        required: [true, "Lecture content is required"],
    },
    duration: {
        type: Number,
        required: [true, "Lecture duration is required"],
    },
    module: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Module ID is required"],
        ref: "Module",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.Lecture = (0, mongoose_1.model)("Lecture", lectureSchema);
