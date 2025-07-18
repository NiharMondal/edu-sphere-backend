"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidation = exports.createCategory = void 0;
const zod_1 = require("zod");
exports.createCategory = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Name is required" })
        .min(5, { message: "Min length is 5" }),
    icon: zod_1.z.string().optional(),
});
exports.categoryValidation = { createCategory: exports.createCategory };
