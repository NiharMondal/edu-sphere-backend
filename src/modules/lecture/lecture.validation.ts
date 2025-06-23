import { z } from "zod";

const createLecture = z.object({
	title: z
		.string({ required_error: "Lecture title is required" })
		.min(5, "Min characters should be 5")
		.max(50, "Characters can not exceed 50 ")
		.trim(),
	type: z.enum(["video", "pdf", "text"]),
	content: z
		.string({ required_error: "Content URL is required" })
		.url({ message: "Enter a valid url" })
		.trim(),
	duration: z
		.number()
		.max(30, { message: "Max duration is 20 minutes" })
		.positive({ message: "Duration should be positive" }),
	module: z.string({ required_error: "Module ID is required" }).trim(),
});

export const lectureValidation = { createLecture };
