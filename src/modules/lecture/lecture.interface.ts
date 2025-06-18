import { Types } from "mongoose";

type Type = "video" | "text" | "pdf";

export interface ILecture {
	title: string;
	type: Type;
	content: string;
	duration: number;
	module: Types.ObjectId;

	isDeleted: boolean;
}
