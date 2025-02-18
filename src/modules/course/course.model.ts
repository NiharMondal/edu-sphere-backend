import { model, Schema } from "mongoose";
import { ICourse } from "./course.interface";

const courseSchema = new Schema<ICourse>(
	{
		thumbnail: {
			type: String,
			required: [true, "Thumbnail is required"],
		},
		title: {
			type: String,
			required: [true, "Course title is required"],
		},
		price: {
			type: Number,
			required: [true, "Price is required"],
		},
		slug: {
			type: String,
			unique: true,
		},
		description: {
			type: String,
			required: [true, "Description is required"],
		},
	},
	{ timestamps: true }
);

export const Course = model<ICourse>("Course", courseSchema);
