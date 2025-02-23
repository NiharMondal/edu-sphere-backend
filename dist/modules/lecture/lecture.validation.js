"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lectureValidation = void 0;
const zod_1 = require("zod");
const createLecture = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: "Lecture title is required" })
        .min(5, "Min characters should be 5")
        .max(50, "Characters can not execed 50 ")
        .trim(),
    type: zod_1.z.enum(["video", "pdf", "txt"]),
    module: zod_1.z.string({ required_error: "Module ID is required" }).trim(),
    url: zod_1.z
        .string({ required_error: "URL is required" })
        .url({ message: "Enter a valid url" })
        .trim(),
});
exports.lectureValidation = { createLecture };
