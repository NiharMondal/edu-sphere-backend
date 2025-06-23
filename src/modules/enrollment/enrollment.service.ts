import mongoose, { Types } from "mongoose";
import CustomError from "../../utils/CustomError";
import { Course } from "../course/course.model";
import { IEnrollment } from "./enrollment.interface";
import { Enrollment } from "./enrollment.model";
import { User } from "../user/user.model";
import QueryBuilder from "../../lib/QueryBuilder";
import { Module } from "../module/module.model";
import { IModule } from "../module/module.interface";
import { ILecture } from "../lecture/lecture.interface";
import { Progress } from "../progress/progress.model";

import Stripe from "stripe";
import { envConfig } from "../../config";
type ExtendLecture = ILecture & { _id: Types.ObjectId };

type PopulatedModule = IModule & {
	lectures: ExtendLecture[];
};
const stripe = new Stripe(envConfig.stripe_secret_key!);

const createIntoDB = async (payload: IEnrollment) => {
	const student = await User.findById(payload.student);
	if (!student) {
		throw new CustomError(404, "Student not found!");
	}

	//find course
	const course = await Course.findById(payload.course).populate({
		path: "modules",
		populate: {
			path: "lectures",
			select: "_id slug",
			model: "Lecture",
		},
		select: "_id slug",
	});

	if (!course) {
		throw new CustomError(404, "Course not found!");
	}
	const existedEnrollment = await Enrollment.findOne({
		course: payload.course,
		student: payload.student,
	});

	if (existedEnrollment) {
		throw new CustomError(400, "You have already enrolled this course");
	}
	// 1. Get all modules for the course sorted by index
	const modules = await Module.find({ course: payload.course })
		.sort({ index: 1 }) // assuming your "index" field determines order
		.populate({
			path: "lectures",
			model: "Lecture",
			match: { isDeleted: false },
		});

	// 2. Find the first lecture across all modules
	let firstLecture: mongoose.Types.ObjectId | null = null;

	for (const module of modules as unknown as PopulatedModule[]) {
		if (module.lectures.length > 0) {
			firstLecture = module.lectures[0]._id;
			break;
		}
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	if (course.pricingType === "paid") {
		try {
			const progressData = new Progress({
				...payload,
				lastWatchedLecture: firstLecture,
			});
			await progressData.save({ session }); // 1st: creating progress for the requested course

			const enrollment = new Enrollment({
				course: payload.course,
				student: payload.student,
				progress: progressData._id,
			});

			const stripeSession = await stripe.checkout.sessions.create({
				payment_method_types: ["card"],
				mode: "payment",
				line_items: [
					{
						price_data: {
							currency: "bdt",
							product_data: { name: course.title },
							unit_amount: Math.round(payload.amount * 100),
						},
						quantity: 1,
					},
				],

				success_url: `${envConfig.front_end_url}/success?session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${envConfig.front_end_url}/cancel`,
				metadata: {
					student: payload.student.toString(),
					course: payload.course.toString(),
					enrollmentId: enrollment._id.toString(),
				},
			} satisfies Stripe.Checkout.SessionCreateParams);

			await enrollment.save({ session });

			await session.commitTransaction();
			await session.endSession();

			return { url: stripeSession.url };
		} catch (error) {
			console.log(error);
			await session.abortTransaction();
			await session.endSession();
			throw new CustomError(400, "Could not enrolled course");
		}
	} else {
		try {
			const progressData = new Progress({
				...payload,
				lastWatchedLecture: firstLecture,
			});
			await progressData.save({ session }); // 1st: creating progress for the requested course

			const data = new Enrollment({
				course: payload.course,
				student: payload.student,
				progress: progressData._id,
			});
			await data.save({ session }); //2nd: creating enrollment or purchase

			await session.commitTransaction();
			session.endSession();

			return data;
		} catch (error) {
			await session.commitTransaction();
			session.endSession();
			throw new CustomError(400, "Could not enrolled course");
		}
	}
};

const getAllFromDB = async (
	query: Record<string, string | string[] | undefined>
) => {
	console.log(query);
	const res = new QueryBuilder(Enrollment.find(), query);

	const data = await res.queryModel;

	return data;
};

const myEnrollment = async (id: string) => {
	const res = await Enrollment.find({ student: id })
		.populate({
			path: "course",
			select: "slug title thumbnail",
		})
		.populate({
			path: "progress",
			select: "progress",
			populate: {
				path: "lastWatchedLecture",
				select: "type",
			},
		});

	return res;
};

export const enrollmentServices = { createIntoDB, getAllFromDB, myEnrollment };
