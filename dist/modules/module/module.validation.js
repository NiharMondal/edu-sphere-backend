"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleValidation = void 0;
const zod_1 = require("zod");
const createModule = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: "Module title is required" })
        .min(5, "Min characters should be 5")
        .max(50, "Characters can not exceed 50")
        .trim(),
    course: zod_1.z.string({ required_error: "Course ID is required" }).trim(),
});
exports.moduleValidation = { createModule };
