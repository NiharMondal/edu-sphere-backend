import { model, Schema } from "mongoose";
import { ILecture } from "./lecture.interface";

const lectureSchema = new Schema<ILecture>(
	{
		title: {
			type: String,
			required: [true, "Lecture title is required"],
			unique: true,
		},
		type: {
			type: String,
			enum: ["video", "post"],
			required: [true, "File type is required"],
		},
		content: {
			type: String,
			required: [true, "Lecture content is required"],
		},
		duration: {
			type: Number,
			required: [true, "Lecture duration is required"],
		},

		module: {
			type: Schema.Types.ObjectId,
			required: [true, "Module ID is required"],
			ref: "Module",
		},

		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const Lecture = model<ILecture>("Lecture", lectureSchema);
