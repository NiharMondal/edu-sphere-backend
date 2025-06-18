import { Types } from "mongoose";

type TStatus = "paid" | "pending";

export interface IEnrollment {
	student: Types.ObjectId;
	course: Types.ObjectId;
	amount: number;
	status: TStatus;
	enrolledAt: Date;
	progress: Types.ObjectId;
}
