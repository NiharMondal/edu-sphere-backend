import { z } from "zod";

const createLecture = z.object({
	title: z
		.string({ required_error: "Lecture title is required" })
		.min(5, "Min characters should be 5")
		.max(50, "Characters can not execed 50 ")
		.trim(),
	type: z.enum(["video", "pdf", "txt"]),
	module: z.string({ required_error: "Module ID is required" }).trim(),
	url: z
		.string({ required_error: "URL is required" })
		.url({ message: "Enter a valid url" })
		.trim(),
});

export const lectureValidation = { createLecture };
