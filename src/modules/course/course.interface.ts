import { Types } from "mongoose";
type TLevel = "Beginner" | "Intermediate" | "Expert";
type PricingType = "paid" | "free";

export interface ICourse {
	title: string;
	slug: string; // auto generated
	thumbnail: string;
	shortVideo: string;
	level: TLevel;
	duration: string;
	description: string;
	pricingType: PricingType;
	price: number;
	rating: number;
	category: Types.ObjectId;
	instructor: Types.ObjectId;
	modules: Types.ObjectId;

	isDeleted: boolean;
}
