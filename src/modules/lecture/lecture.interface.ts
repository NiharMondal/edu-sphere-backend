import { Types } from "mongoose";

type Type = "video" | "post";

export interface ILecture {
	title: string;
	type: Type;
	content: string;
	duration: number;
	module: Types.ObjectId;
	isDeleted: boolean;
}
