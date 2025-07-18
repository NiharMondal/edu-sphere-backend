"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const registerUser = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Name is required" })
        .min(3, "Min length should be 3 characters")
        .max(30, "Name max length is 30")
        .trim(),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email should be a valid email" })
        .toLowerCase()
        .trim(),
    role: zod_1.z.enum(["student", "admin", "instructor"]).optional(),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, "Password should be at least 6 characters")
        .max(28, "Password max length is 28")
        .trim(),
});
const loginUser = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email should be valid email" })
        .trim(),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, "Password should be at least 6 characters")
        .max(28, "Password max length is 28")
        .trim(),
});
exports.authValidation = { registerUser, loginUser };
