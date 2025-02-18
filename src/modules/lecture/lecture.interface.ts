import { Types } from "mongoose";

export interface ILecture {
	title: string;
	type: string;
	module: Types.ObjectId;
	url: string;
}
