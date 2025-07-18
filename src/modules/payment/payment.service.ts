import Stripe from "stripe";
import CustomError from "../../utils/CustomError";

import { Enrollment } from "../enrollment/enrollment.model";
import { PaymentHistory } from "./payment.model";
import { envConfig } from "../../config";
import QueryBuilder from "../../lib/QueryBuilder";

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

		// 1. Update Enrollment
		await Enrollment.findByIdAndUpdate(session?.metadata?.enrollmentId, {
			$set: {
				status: "paid",
			},
		});

		// 2. Save Payment History
		await PaymentHistory.create({
			student: session?.metadata?.student,
			course: session?.metadata?.course,
			checkoutSessionId: session?.id,
			amount: session?.amount_total! / 100,
			currency: session!.currency,
			paymentStatus: session?.payment_status,
			paymentIntentId: session?.payment_intent,
			customerDetails: {
				email: session?.customer_details?.email,
				name: session?.customer_details?.name,
				address: session?.customer_details?.address,
			},
		});
	}
};

const getAllFromDB = async (query: Record<string, string>) => {
	const data = new QueryBuilder(PaymentHistory.find(), query).sort();

	const paymentHistory = await data.queryModel
		.populate({ path: "student", select: "name" })
		.populate({ path: "course", select: "title" })
		.select("paymentIntentId student course amount");

	return paymentHistory;
};

export const paymentServices = { createIntoDB, getAllFromDB };
