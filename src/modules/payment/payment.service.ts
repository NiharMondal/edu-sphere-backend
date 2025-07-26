import Stripe from "stripe";
import CustomError from "../../utils/CustomError";

import { Enrollment } from "../enrollment/enrollment.model";
import { PaymentHistory } from "./payment.model";
import { envConfig } from "../../config";
import QueryBuilder from "../../lib/QueryBuilder";
import { Module } from "../module/module.model";
import { Course } from "../course/course.model";
import mongoose, { Types } from "mongoose";
import { Progress } from "../progress/progress.model";
import { IModule } from "../module/module.interface";
import { ILecture } from "../lecture/lecture.interface";
import { getIO, getUserSocketMap } from "../../socket";
import { Notification } from "../notification/notification.model";
import { TQuery } from "../../type";

type ExtendLecture = ILecture & { _id: Types.ObjectId };

type PopulatedModule = IModule & {
	lectures: ExtendLecture[];
};
const stripe = new Stripe(envConfig.stripe_secret_key as string);

const webhookSecret = envConfig.stripe_web_secret as string;

const createIntoDB = async (body: any, sig: any) => {
	let event;
	try {
		event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
	} catch (err) {
		throw new CustomError(400, `Webhook Error: ${err as any}.message`);
	}

	// Handle successful payment
	if (event.type === "checkout.session.completed") {
		const session = event.data.object as Stripe.Checkout.Session;

		const studentId = session.metadata?.student;
		const courseId = session.metadata?.course;
		const pricingType = session.metadata?.pricingType;

		const dbSession = await mongoose.startSession();
		dbSession.startTransaction();

		try {
			// Find course and student
			const course = await Course.findById(courseId).populate({
				path: "modules",
				select: "_id slug",
				populate: {
					path: "lectures",
					select: "_id slug",
				},
			});
			if (!course) throw new Error("Course not found");

			// Get first lecture
			const modules = await Module.find({ course: courseId })
				.sort({ index: 1 })
				.populate({ path: "lectures", match: { isDeleted: false } });

			let firstLecture: mongoose.Types.ObjectId | null = null;

			for (const module of modules as unknown as PopulatedModule[]) {
				if (module.lectures.length > 0) {
					firstLecture = module.lectures[0]._id;
					break;
				}
			}

			// Create progress
			const progress = await Progress.create(
				[
					{
						course: courseId,
						student: studentId,
						lastWatchedLecture: firstLecture,
					},
				],
				{ session: dbSession }
			);

			// Create enrollment
			const enrollment = await Enrollment.create(
				[
					{
						course: courseId,
						student: studentId,
						progress: progress[0]._id,
						pricingType,
						status: "paid",
					},
				],
				{ session: dbSession }
			);

			// Create notification
			const notification = await Notification.create(
				[
					{
						user: studentId,
						type: "enrollment",
						message: `Welcome to ${course?.title}`,
					},
				],

				{ session: dbSession }
			);

			// Real-time emit
			const io = getIO();
			const socketId = getUserSocketMap().get(studentId as string);
			if (socketId) {
				io.to(socketId).emit("new-notification", notification[0]);
			}

			// Save payment history
			await PaymentHistory.create(
				[
					{
						student: studentId,
						course: courseId,
						checkoutSessionId: session.id,
						amount: session.amount_total! / 100,
						currency: session.currency,
						paymentStatus: session.payment_status,
						paymentIntentId: session.payment_intent,
						customerDetails: {
							email: session.customer_details?.email,
							name: session.customer_details?.name,
							address: session.customer_details?.address,
						},
					},
				],
				{ session: dbSession }
			);

			await dbSession.commitTransaction();
		} catch (err) {
			console.error("Webhook failed:", err);
			await dbSession.abortTransaction();
		} finally {
			dbSession.endSession();
		}
	}
};

const getAllFromDB = async (query: TQuery) => {
	const queryBuilder = new QueryBuilder(PaymentHistory.find(), query)
		.search(["paymentIntentId"])
		.filter()
		.pagination()
		.sort()
		.fields()
		.populate([
			{ path: "student", select: "name" },
			{ path: "course", select: "title" },
		]);

	const paymentHistory = await queryBuilder.getQuery();
	const meta = await queryBuilder.countTotal();

	return { meta, paymentHistory };
};

export const paymentServices = { createIntoDB, getAllFromDB };
