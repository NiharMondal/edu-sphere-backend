import mongoose from "mongoose";
import { IReview } from "./review.interface";
import { User } from "../user/user.model";
import CustomError from "../../utils/CustomError";
import { Course } from "../course/course.model";
import { Review } from "./review.model";

const createIntoDB = async (payload: IReview) => {
	//find user
	const user = await User.findById(payload.user);
	if (!user) {
		throw new CustomError(404, "User not found!");
	}

	//find course
	const course = await Course.findById(payload.course);
	if (!course) {
		throw new CustomError(404, "Course not found!");
	}

	// checking user gave a review
	const existedReview = await Review.findOne({
		user: payload.user,
		course: payload.course,
	});
	if (existedReview) {
		throw new CustomError(400, "You already gave a review to this course!");
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// create Review
		const review = new Review(payload);
		await review.save({ session });

		// find all given Review to this course;
		const countReview = await Review.find({
			course: payload.course,
		}).session(session);

		const totalRating = countReview.reduce(
			(prev, curr) => prev + curr.rating,
			0
		);

		//calculating avg rating
		const avgRating = Math.round(totalRating / countReview.length);

		// updating course rating field
		await Course.findByIdAndUpdate(
			payload.course,
			{
				$set: {
					rating: avgRating,
				},
			},
			{ new: true, runValidators: true }
		);

		await session.commitTransaction();
		await session.endSession();

		return review;
	} catch (error) {
		console.log(error);
		await session.abortTransaction();
		await session.endSession();
	}
};

export const reviewServices = { createIntoDB };
