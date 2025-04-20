import { Types } from "mongoose";

export interface IUser {
	name: string;
	email: string;
	avatar: string;
	password: string;
	role: string;
	enrolledCourses: Types.ObjectId;
	createdCourses: Types.ObjectId;
	isDeleted: boolean;
}
