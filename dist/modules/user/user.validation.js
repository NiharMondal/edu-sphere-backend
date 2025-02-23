"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const createrUser = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Name is required" })
        .min(3, "Min length should be 3 characters")
        .max(30, "Name max length is 30")
        .trim(),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email should be valid email" })
        .trim(),
    role: zod_1.z.enum(["user", "admin"]).optional(),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, "Password should be at least 6 characters")
        .max(28, "Password max length is 28")
        .trim(),
});
