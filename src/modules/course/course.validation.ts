import { z } from "zod";

const createCourse = z.object({
	thumbnail: z
		.string({ required_error: "Thumbnail is required" })
		.url({ message: "Provide a valid URL" })
		.trim(),
	title: z
		.string({ required_error: "Course title is required" })
		.min(5, "Min characters should be 5")
		.max(50, "Characters can not execed 50 ")
		.trim(),
	price: z.number({ required_error: "Course price is required" }).positive(),
	description: z
		.string({ required_error: "Description is required" })
		.min(20, "Min characters should be 20")
		.trim(),
});

export const courseValidation = { createCourse };
