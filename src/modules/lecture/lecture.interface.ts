import { Types } from "mongoose";

export interface ILecture {
	title: string;
	slug: string;
	videoUrl: string;
	type: string;
	module: Types.ObjectId;
	attachments: string;
	isDeleted: boolean;
}
