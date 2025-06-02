import { Types } from "mongoose";

export interface IReview {
	user: Types.ObjectId;
	course: Types.ObjectId;
	rating: number;
	message: string;
}
