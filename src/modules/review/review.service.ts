import mongoose from "mongoose";
import { IReview } from "./review.interface";
import { User } from "../user/user.model";
import CustomError from "../../utils/CustomError";
import { Course } from "../course/course.model";
import { Review } from "./review.model";
import QueryBuilder from "../../lib/QueryBuilder";
import { TQuery } from "../../type";

const createIntoDB = async (payload: IReview) => {
	//find student
	const student = await User.findById(payload.student);
	if (!student) {
		throw new CustomError(404, "User not found!");
	}

	//find course
	const course = await Course.findById(payload.course);
	if (!course) {
		throw new CustomError(404, "Course not found!");
	}

	// checking user gave a review
	const existedReview = await Review.findOne({
		user: payload.student,
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
			(acc, curr) => acc + curr.rating,
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

const getAllFromDB = async (query: TQuery) => {
	const res = new QueryBuilder(Review.find(), query)
		.search(["message"])
		.filter()
		.sort();

	const reviews = await res.queryModel
		.populate({ path: "student", select: "name" })
		.populate({ path: "course", select: "title" });

	return reviews;
};

const getById = async (id: string) => {
	const data = await Review.findById(id);

	if (!data) {
		throw new CustomError(404, "Review not found");
	}
	return data;
};

const getByCourseId = async (courseId: string) => {
	const review = await Review.findOne({ course: courseId });

	if (!review) {
		throw new CustomError(404, "Review not found");
	}

	return review;
};

const updateDoc = async (
	id: string,
	payload: Pick<IReview, "rating" | "message">
) => {
	const review = await Review.findById(id);

	if (!review) {
		throw new CustomError(404, "Review not found");
	}

	const updatedData = await Review.findByIdAndUpdate(
		id,
		{
			$set: {
				...payload,
			},
		},
		{ new: true, runValidators: true }
	);

	return updatedData;
};

const deleteDoc = async (id: string) => {
	const deletedData = await Review.findByIdAndDelete(id);

	if (!deletedData) {
		throw new CustomError(404, "Review is not deleted");
	}
	return deletedData;
};
const acceptReview = async (id: string) => {
	const updatedData = await Review.findByIdAndUpdate(
		{ _id: id },
		{ isAccepted: true },
		{ new: true }
	);

	return updatedData;
};
const undoAccept = async (id: string) => {
	const updatedData = await Review.findByIdAndUpdate(
		{ _id: id },
		{ isAccepted: false },
		{ new: true }
	);

	return updatedData;
};
export const reviewServices = {
	createIntoDB,
	getAllFromDB,
	getById,
	getByCourseId,
	updateDoc,
	deleteDoc,
	acceptReview,
	undoAccept,
};
