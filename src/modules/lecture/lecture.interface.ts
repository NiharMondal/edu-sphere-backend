import { Types } from "mongoose";

export interface ILecture {
	title: string;
	type: string;
	content: string;
	duration: number;
	module: Types.ObjectId;

	isDeleted: boolean;
}
