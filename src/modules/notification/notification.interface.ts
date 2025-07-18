import { Types } from "mongoose";

export interface INotification {
	student: Types.ObjectId;
	message: string;
	isRead: boolean;
	link: string;
	type: string;
}
