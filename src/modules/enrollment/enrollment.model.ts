import { model, Schema } from "mongoose";
import { IEnrollment } from "./enrollment.interface";

const enrollmentSchema = new Schema<IEnrollment>(
	{
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
			default: 0,
		},
		lastWatchedLecture: {
			type: Schema.Types.ObjectId,
			ref: "Lecture",
			default: null,
		},
		enrolledAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

export const Enrollment = model<IEnrollment>("Enrollment", enrollmentSchema);
