import { z } from "zod";

const createCourse = z.object({
	title: z
		.string({ required_error: "Course title is required" })
		.min(5, "Min characters should be 5")
		.max(50, "Characters can not exceed 50")
		.trim(),
	thumbnail: z
		.string({ required_error: "Thumbnail is required" })
		.url({ message: "Provide a valid URL" })
		.trim(),
	price: z
		.number({ required_error: "Course price is required" })
		.positive()
		.max(30000, "Course max price is 30,000"),
	description: z
		.string({ required_error: "Description is required" })
		.min(20, "Min characters should be 20")
		.max(500, "Max character is 500")
		.trim(),
	instructor: z.string({ required_error: "Instructor is is missing" }).trim(),
});

export const courseValidation = { createCourse };
