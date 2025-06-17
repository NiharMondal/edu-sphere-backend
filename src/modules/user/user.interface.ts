import { Types } from "mongoose";

export interface IUser {
	name: string;
	email: string;
	avatar: string;
	password: string;
	phone: string;
	role: string;

	isDeleted: boolean;
}
