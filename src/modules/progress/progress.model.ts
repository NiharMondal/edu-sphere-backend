import { model, Schema } from "mongoose";
import { IProgress } from "./progress.interface";

const progressSchema = new Schema<IProgress>({
	student: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: [true, "Student ID is required"],
	},
	course: {
		type: Schema.Types.ObjectId,
		ref: "Course",
		required: [true, "Course ID is required"],
	},
	progress: {
		type: Number,
		default: 0, // in percentage
	},
	lastWatchedLecture: {
		type: Schema.Types.ObjectId,
		ref: "Lecture",
		default: null,
	},
	completedLectures: [String],
});

export const Progress = model<IProgress>("Progress", progressSchema);
