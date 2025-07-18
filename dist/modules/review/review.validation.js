"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidation = void 0;
const zod_1 = require("zod");
const createReview = zod_1.z.object({
    course: zod_1.z
        .string({ required_error: "Course ID is required" })
        .trim(),
    student: zod_1.z
        .string({ required_error: "Student ID is required" })
        .trim(),
    rating: zod_1.z
        .number({ required_error: "Rating is required" })
        .min(1, { message: "Min value is 1" })
        .max(5, { message: "Max value is 5" }),
    message: zod_1.z.string({ required_error: "Review message is required" }).trim(),
});
exports.reviewValidation = { createReview };
