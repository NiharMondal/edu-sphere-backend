"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseValidation = void 0;
const zod_1 = require("zod");
const createCourse = zod_1.z.object({
    thumbnail: zod_1.z
        .string({ required_error: "Thumbnail is required" })
        .url({ message: "Provide a valid URL" })
        .trim(),
    title: zod_1.z
        .string({ required_error: "Course title is required" })
        .min(5, "Min characters should be 5")
        .max(50, "Characters can not execed 50 ")
        .trim(),
    price: zod_1.z.number({ required_error: "Course price is required" }).positive(),
    description: zod_1.z
        .string({ required_error: "Description is required" })
        .min(20, "Min characters should be 20")
        .trim(),
});
exports.courseValidation = { createCourse };
