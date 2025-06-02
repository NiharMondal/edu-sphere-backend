import { model, Schema } from "mongoose";
import { ICourse } from "./course.interface";

const courseSchema = new Schema<ICourse>(
	{
		title: {
			type: String,
			required: [true, "Course title is required"],
			unique: [true, "Course title should be unique"],
		},
		slug: {
			type: String,
		},
		thumbnail: {
			type: String,
			required: [true, "Thumbnail is required"],
		},
		description: {
			type: String,
			required: [true, "Description is required"],
		},
		price: {
			type: Number,
			required: [true, "Price is required"],
		},
		rating: {
			type: Number,
			default: null,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		instructor: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Instructor ID is required"],
		},
		modules: [
			{
				type: Schema.Types.ObjectId,
				ref: "Module",
			},
		],

		students: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

export const Course = model<ICourse>("Course", courseSchema);
