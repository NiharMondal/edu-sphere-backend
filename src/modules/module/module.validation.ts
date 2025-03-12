import { z } from "zod";

const createModule = z.object({
	title: z
		.string({ required_error: "Module title is required" })
		.min(5, "Min characters should be 5")
		.max(50, "Characters can not exceed 50")
		.trim(),
	course: z.string({ required_error: "Course ID is required" }).trim(),
});

export const moduleValidation = { createModule };
