import { Types } from "mongoose";

export interface ICourse {
	title: string;
	slug: string; // auto generated
	thumbnail: string;
	shortVideo: string;
	level: string;
	duration: string;
	description: string;
	pricingType: string;
	price: number;
	rating: number;
	category: Types.ObjectId;
	instructor: Types.ObjectId;
	modules: Types.ObjectId;

	isDeleted: boolean;
}
