"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enrollment = void 0;
const mongoose_1 = require("mongoose");
const enrollmentSchema = new mongoose_1.Schema({
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
    pricingType: {
        type: String,
        enum: ["free", "paid"],
    },
    status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
    },
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
    progress: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Progress",
    },
}, { timestamps: true });
exports.Enrollment = (0, mongoose_1.model)("Enrollment", enrollmentSchema);
