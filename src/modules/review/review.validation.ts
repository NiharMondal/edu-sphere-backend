import { z } from "zod";

const createReview = z.object({
	course: z
		.string({ required_error: "Course ID is required" })

		.trim(),
	student: z
		.string({ required_error: "Student ID is required" })

		.trim(),

	rating: z
		.number({ required_error: "Rating is required" })
		.min(1, { message: "Min value is 1" })
		.max(5, { message: "Max value is 5" }),
	message: z.string({ required_error: "Review message is required" }).trim(),
});
export const updateReview = z.object({
	rating: z
		.number()
		.min(1, { message: "Min rating value is 1" })
		.max(5, { message: "Max rating value is 5" })
		.optional(),
	message: z
		.string({ required_error: "Message is required" })
		.nonempty({ message: "Message can not be empty" })
		.optional(),
});

export const reviewValidation = { createReview, updateReview };
