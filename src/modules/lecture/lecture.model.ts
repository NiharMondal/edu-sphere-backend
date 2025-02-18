import { model, Schema } from "mongoose";
import { ILecture } from "./lecture.interface";

const lectureSchema = new Schema<ILecture>(
	{
		title: {
			type: String,
			required: [true, "Lecture title is required"],
		},
		type: {
			type: String,
			enum: ["video", "text", "pdf"],
		},
		module: {
			type: Schema.Types.ObjectId,
			ref: "Module",
		},
		url: {
			type: String,
			required: [true, "Url is required"],
		},
	},
	{ timestamps: true }
);

export const Lecture = model<ILecture>("Lecture", lectureSchema);
