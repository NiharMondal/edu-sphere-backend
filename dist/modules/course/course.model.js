"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    thumbnail: {
        type: String,
        required: [true, "Thumbnail is required"],
    },
    title: {
        type: String,
        required: [true, "Course title is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    slug: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    modules: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Module",
        },
    ],
}, { timestamps: true });
exports.Course = (0, mongoose_1.model)("Course", courseSchema);
