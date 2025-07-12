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
		pricingType: {
			type: String,
			enum: ["free", "paid"],
		},
		status: {
			type: String,
			enum: ["pending", "paid"],
			default: "pending",
		},

		enrolledAt: {
			type: Date,
			default: Date.now,
		},
		progress: {
			type: Schema.Types.ObjectId,
			ref: "Progress",
		},
	},
	{ timestamps: true }
);

export const Enrollment = model<IEnrollment>("Enrollment", enrollmentSchema);
