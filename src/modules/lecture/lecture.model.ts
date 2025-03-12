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
		videoUrl: {
			type: String,
		},
		attachments: [
			{
				type: String,
			},
		],
		module: {
			type: Schema.Types.ObjectId,
			required: [true, "Module ID is required"],
			ref: "Module",
		},
	},
	{ timestamps: true }
);

export const Lecture = model<ILecture>("Lecture", lectureSchema);
