"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lecture = void 0;
const mongoose_1 = require("mongoose");
const lectureSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Lecture title is required"],
    },
    type: {
        type: String,
        enum: ["video", "text", "pdf"],
    },
    module: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Module",
    },
    url: {
        type: String,
        required: [true, "Url is required"],
    },
}, { timestamps: true });
exports.Lecture = (0, mongoose_1.model)("Lecture", lectureSchema);
