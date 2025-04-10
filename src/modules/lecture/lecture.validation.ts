import { z } from "zod";

const createLecture = z.object({
	title: z
		.string({ required_error: "Lecture title is required" })
		.min(5, "Min characters should be 5")
		.max(50, "Characters can not exceed 50 ")
		.trim(),
	type: z.enum(["video", "pdf", "text"]),
	content: z.string().url({ message: "Enter a valid url" }).trim().optional(),
	duration: z.string().optional(),
	module: z.string({ required_error: "Module ID is required" }).trim(),
});

export const lectureValidation = { createLecture };
