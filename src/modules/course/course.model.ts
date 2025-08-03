import { model, Schema } from "mongoose";
import { ICourse } from "./course.interface";

const courseSchema = new Schema<ICourse>(
	{
		title: {
			type: String,
			required: [true, "Course title is required"],
			unique: [true, "Course title should be unique"],
		},
		thumbnail: {
			type: String,
			required: [true, "Thumbnail is required"],
		},
		shortVideo: {
			type: String,
		},
		level: {
			type: String,
			enum: ["Beginner", "Intermediate", "Expert"],
			default: "Beginner",
		},
		duration: {
			type: String,
			required: [true, "Duration is required"],
		},
		description: {
			type: String,
			required: [true, "Description is required"],
		},
		pricingType: {
			type: String,
			enum: ["free", "paid"],
			default: "paid",
			required: [true, "Pricing type is required"],
		},
		price: {
			type: Number,
			required: function () {
				return this.pricingType === "paid";
			},
		},
		rating: {
			type: Number,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			required: [true, "Category is required"],
		},
		instructor: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Instructor is required"],
		},
		slug: {
			type: String,
			unique: true,
		},
		modules: [
			{
				type: Schema.Types.ObjectId,
				ref: "Module",
			},
		],
	},
	{ timestamps: true }
);

export const Course = model<ICourse>("Course", courseSchema);
