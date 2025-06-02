import { z } from "zod";

const createReview = z.object({
	course: z
		.string({ required_error: "Course ID is required" })
		.nonempty()
		.trim(),
	user: z.string({ required_error: "User ID is required" }).nonempty().trim(),
	rating: z
		.number({ required_error: "Rating is required" })
		.min(1, { message: "Min value is 1" })
		.max(5, { message: "Max value is 5" }),
	message: z.string().trim().optional(),
});

export const reviewValidation = { createReview };
