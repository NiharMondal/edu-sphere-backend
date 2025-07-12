import { z } from "zod";

const createCourse = z.object({
	title: z
		.string({ required_error: "Name is required" })
		.min(10, "Should be more than 10 characters")
		.max(80, "Should be less than 80 characters"),
	price: z.coerce
		.number({ required_error: "Price is required" })
		.positive({ message: "Price can not be negative" })
		.max(15000, "Should be less than 15000 Taka"),
	pricingType: z.enum(["paid", "free"]),
	shortVideo: z
		.string()
		.url({ message: "Link should be a valid url" })
		.trim()
		.optional(),
	level: z.enum(["Beginner", "Intermediate", "Expert"]),
	category: z
		.string({ required_error: "Category is required" })
		.nonempty({ message: "Category can not be empty" })
		.trim(),
	duration: z.string({ required_error: "Duration is required" }).trim(),
	description: z
		.string({ required_error: "Description is required" })
		.min(20, { message: "Min characters is 20" })
		.max(1000, { message: "Max character is 1000" })
		.trim(),
	instructor: z
		.string({ required_error: "Instructor is required" })
		.nonempty({ message: "Please select instructor" })
		.trim(),
	thumbnail: z
		.string({ required_error: "Thumbnail is required" })
		.url({ message: "Provide a valid URL" })
		.trim(),
});

export const courseValidation = { createCourse };
