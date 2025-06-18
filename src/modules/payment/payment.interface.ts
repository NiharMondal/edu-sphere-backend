import { Types } from "mongoose";

export interface IPayment {
	student: Types.ObjectId;
	course: Types.ObjectId;
	amount: number;
	currency: string;
	paymentStatus: string;
	paymentIntentId: string;
	checkoutSessionId: string;
}
