"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "User",
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Course ID is required"],
        ref: "Course",
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
    },
    message: {
        type: String,
        required: [true, "Message is required"],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isAccepted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.Review = (0, mongoose_1.model)("Review", reviewSchema);
