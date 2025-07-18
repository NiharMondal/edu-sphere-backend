"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lectureValidation = void 0;
const zod_1 = require("zod");
const validateVideoUrl_1 = require("../../utils/validateVideoUrl");
const createLecture = zod_1.z
    .object({
    title: zod_1.z
        .string({ required_error: "Lecture title is required" })
        .min(10, "Min length is 10")
        .max(60, "Max length is 60")
        .trim(),
    type: zod_1.z.enum(["video", "post"]),
    module: zod_1.z
        .string({ required_error: "Module ID is required" })
        .nonempty({ message: "Please select a module" }),
    duration: zod_1.z.coerce
        .number({ required_error: "Duration is required" })
        .positive({ message: "Duration can not be negative" })
        .max(30, "Should be less than 30 minutes"),
    course: zod_1.z
        .string({ required_error: "Course is required" })
        .nonempty({ message: "Select course to find module" }),
    content: zod_1.z.string({ required_error: "Content is required" }).trim(),
})
    .superRefine((data, ctx) => {
    if (data.type === "video") {
        if (!(0, validateVideoUrl_1.isValidVideoUrl)(data.content)) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "Video must be a valid YouTube or Vimeo URL",
                path: ["content"],
            });
        }
    }
    else if (data.type === "post") {
        if (data.content.length < 30) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.too_small,
                type: "string",
                minimum: 30,
                inclusive: true,
                message: "Post content must be at least 30 characters",
                path: ["content"],
            });
        }
    }
});
exports.lectureValidation = { createLecture };
