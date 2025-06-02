import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>({
	user: {
		type: Schema.Types.ObjectId,
		required: [true, "User ID is required"],
		ref: "User",
	},
	course: {
		type: Schema.Types.ObjectId,
		required: [true, "Course ID is required"],
		ref: "Course",
	},
	rating: {
		type: Number,
		required: [true, "Rating is required"],
	},
	message: {
		type: String,
	},
});

export const Review = model<IReview>("Review", reviewSchema);
