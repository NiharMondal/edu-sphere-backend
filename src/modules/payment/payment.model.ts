import { model, Schema } from "mongoose";
import { IPayment } from "./payment.interface";

const paymentHistorySchema = new Schema<IPayment>(
	{
		student: {
			type: Schema.Types.ObjectId,
			required: [true, "Student ID is required"],
			ref: "User",
		},
		course: {
			type: Schema.Types.ObjectId,
			required: [true, "Course ID is required"],
			ref: "Course",
		},
		checkoutSessionId: {
			type: String,
			required: [true, "Checkout session ID is required"],
		},
		amount: {
			type: Number,
			required: [true, "Course Amount is required"],
		},
		currency: String,
		paymentStatus: String,
		paymentIntentId: String,
		customerDetails: {
			email: String,
			name: String,
			address: Schema.Types.Mixed,
		},
	},
	{ timestamps: true }
);

export const PaymentHistory = model<IPayment>(
	"PaymentHistory",
	paymentHistorySchema
);
