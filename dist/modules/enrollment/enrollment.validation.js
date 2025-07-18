"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentValidation = void 0;
const zod_1 = require("zod");
const createEnrollment = zod_1.z.object({
    student: zod_1.z.string({ required_error: "Student ID is required" }).trim(),
    course: zod_1.z.string({ required_error: "Course ID is required" }).trim(),
});
exports.enrollmentValidation = { createEnrollment };
