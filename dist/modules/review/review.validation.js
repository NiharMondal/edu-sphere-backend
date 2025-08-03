"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidation = exports.updateReview = void 0;
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
exports.updateReview = zod_1.z.object({
    rating: zod_1.z
        .number()
        .min(1, { message: "Min rating value is 1" })
        .max(5, { message: "Max rating value is 5" })
        .optional(),
    message: zod_1.z
        .string({ required_error: "Message is required" })
        .nonempty({ message: "Message can not be empty" })
        .optional(),
});
exports.reviewValidation = { createReview, updateReview: exports.updateReview };
