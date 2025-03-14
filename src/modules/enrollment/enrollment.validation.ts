import { z } from "zod";

const createEnrollment = z.object({
	student: z.string({ required_error: "Student ID is required" }).trim(),
	course: z.string({ required_error: "Course ID is required" }).trim(),
});

export const enrollmentValidation = { createEnrollment };
