import { Types } from "mongoose";

export interface ICourse {
	thumbnail: string;
	title: string;
	price: number;
	slug: string;
	description: string;
	modules: Types.ObjectId;
}
