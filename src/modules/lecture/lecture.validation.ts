import { z } from "zod";
import { isValidVideoUrl } from "../../utils/validateVideoUrl";

const createLecture = z
	.object({
		title: z
			.string({ required_error: "Lecture title is required" })
			.min(10, "Min length is 10")
			.max(60, "Max length is 60")
			.trim(),
		type: z.enum(["video", "post"]),
		module: z
			.string({ required_error: "Module ID is required" })
			.nonempty({ message: "Please select a module" }),
		duration: z.coerce
			.number({ required_error: "Duration is required" })
			.positive({ message: "Duration can not be negative" })
			.max(30, "Should be less than 30 minutes"),
		course: z
			.string({ required_error: "Course is required" })
			.nonempty({ message: "Select course to find module" }),
		content: z.string({ required_error: "Content is required" }).trim(),
	})
	.superRefine((data, ctx) => {
		if (data.type === "video") {
			if (!isValidVideoUrl(data.content)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Video must be a valid YouTube or Vimeo URL",
					path: ["content"],
				});
			}
		} else if (data.type === "post") {
			if (data.content.length < 30) {
				ctx.addIssue({
					code: z.ZodIssueCode.too_small,
					type: "string",
					minimum: 30,
					inclusive: true,
					message: "Post content must be at least 30 characters",
					path: ["content"],
				});
			}
		}
	});

export const lectureValidation = { createLecture };
