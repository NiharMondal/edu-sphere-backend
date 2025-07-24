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
import { Notification } from "../notification/notification.model";
import { getIO, getUserSocketMap } from "../../socket";
type ExtendLecture = ILecture & { _id: Types.ObjectId };

type PopulatedModule = IModule & {
	lectures: ExtendLecture[];
};
const stripe = new Stripe(envConfig.stripe_secret_key!);

const createIntoDB = async (payload: IEnrollment) => {
	//find student by id
	const student = await User.findById(payload.student);
	if (!student) {
		throw new CustomError(404, "Student not found!");
	}

	//find course
	const course = await Course.findById(payload.course).populate({
		path: "modules",
		select: "_id slug",
		populate: {
			path: "lectures",
			select: "_id slug",
			model: "Lecture",
		},
	});

	if (!course) {
		throw new CustomError(404, "Course not found!");
	}

	//checking existing enrollment
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

	try {
		if (course.pricingType === "free") {
			// Free: Create progress, enrollment, notification
			const progress = new Progress({
				...payload,
				lastWatchedLecture: firstLecture,
			});
			await progress.save({ session });

			const enrollment = new Enrollment({
				course: payload.course,
				student: payload.student,
				progress: progress._id,
				pricingType: course.pricingType,
			});
			await enrollment.save({ session });

			const notification = new Notification({
				user: payload.student,
				type: "enrollment",
				message: `Welcome to ${course.title}`,
			});
			await notification.save({ session });

			// Emit notification
			const socketId = getUserSocketMap().get(payload.student.toString());
			if (socketId) {
				getIO().to(socketId).emit("new-notification", notification);
			}

			await session.commitTransaction();
			return enrollment;
		} else {
			// Paid: Just create Stripe Checkout Session, no DB write here
			await session.commitTransaction(); // nothing done, but still clean
			const stripeSession = await stripe.checkout.sessions.create({
				payment_method_types: ["card", "paypal"],
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
					pricingType: course.pricingType,
				},
			} satisfies Stripe.Checkout.SessionCreateParams);

			return { url: stripeSession.url };
		}
	} catch (error) {
		console.error(error);
		await session.abortTransaction();
		throw new CustomError(400, "Could not process enrollment");
	} finally {
		await session.endSession();
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
			select: "title thumbnail instructor",
			populate: {
				path: "instructor",
				select: "name",
			},
		})
		.populate({
			path: "progress",
			select: "progress",
			populate: {
				path: "lastWatchedLecture",
				select: "type",
			},
		})
		.sort({ createdAt: -1 });

	return res;
};

export const enrollmentServices = { createIntoDB, getAllFromDB, myEnrollment };
