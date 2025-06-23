import { Types } from "mongoose";
type TCustomerDetails = {
	email: string;
	name: string;
	address: {};
};
export interface IPayment {
	student: Types.ObjectId;
	course: Types.ObjectId;
	checkoutSessionId: string;
	amount: number;
	currency: string;
	paymentStatus: string;
	paymentIntentId: string;
	customerDetails: TCustomerDetails;
}
