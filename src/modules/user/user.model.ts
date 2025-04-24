import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import bcrypt from "bcrypt";
import { envConfig } from "../../config";

const userSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true, // This ensures a MongoDB-level constraint
			lowercase: true,
			trim: true,
		},
		avatar: {
			type: String,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		role: {
			type: String,
			enum: ["student", "instructor", "admin"],
			default: "student",
		},

		enrolledCourses: [
			{
				type: Schema.Types.ObjectId,
				ref: "Enrollment",
			},
		],
		createdCourses: [
			{
				type: Schema.Types.ObjectId,
				ref: "Course",
			},
		],
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	const hashedPassword = await bcrypt.hash(
		this.password,
		envConfig.salt_round
	);
	this.password = hashedPassword;

	next();
});

export const User = model<IUser>("User", userSchema);
