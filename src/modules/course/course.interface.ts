import { Types } from "mongoose";

export interface ICourse {
	title: string;
	slug: string;
	thumbnail: string;
	description: string;
	price: number;
	instructor: Types.ObjectId;
	modules: Types.ObjectId;
	students: Types.ObjectId;
}
