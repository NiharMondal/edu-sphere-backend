"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseValidation = void 0;
const zod_1 = require("zod");
const createCourse = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: "Name is required" })
        .min(10, "Should be more than 10 characters")
        .max(80, "Should be less than 80 characters"),
    price: zod_1.z.coerce
        .number({ required_error: "Price is required" })
        .positive({ message: "Price can not be negative" })
        .max(15000, "Should be less than 15000 Taka"),
    pricingType: zod_1.z.enum(["paid", "free"]),
    shortVideo: zod_1.z
        .string()
        .url({ message: "Link should be a valid url" })
        .trim()
        .optional(),
    level: zod_1.z.enum(["Beginner", "Intermediate", "Expert"]),
    category: zod_1.z
        .string({ required_error: "Category is required" })
        .nonempty({ message: "Category can not be empty" })
        .trim(),
    duration: zod_1.z.string({ required_error: "Duration is required" }).trim(),
    description: zod_1.z
        .string({ required_error: "Description is required" })
        .min(20, { message: "Min characters is 20" })
        .max(1000, { message: "Max character is 1000" })
        .trim(),
    instructor: zod_1.z
        .string({ required_error: "Instructor is required" })
        .nonempty({ message: "Please select instructor" })
        .trim(),
    thumbnail: zod_1.z
        .string({ required_error: "Thumbnail is required" })
        .url({ message: "Provide a valid URL" })
        .trim(),
});
exports.courseValidation = { createCourse };
