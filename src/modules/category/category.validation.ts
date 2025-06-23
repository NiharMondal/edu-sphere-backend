import { z } from "zod";

export const createCategory = z.object({
	name: z
		.string({ required_error: "Name is required" })
		.min(5, { message: "Min length is 5" }),
	icon: z.string().optional(),
});

export const categoryValidation = { createCategory };
