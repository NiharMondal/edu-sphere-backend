import { model, Schema } from "mongoose";
import { INotification } from "./notification.interface";

const notificationSchema = new Schema<INotification>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "User ID is required"],
		},
		message: {
			type: String,
			required: [true, "Message is required"],
		},
		isRead: {
			type: Boolean,
			default: false,
		},
		link: {
			type: String, // Optional: e.g., /dashboard/courses/123
		},
		type: {
			type: String, // Optional: "enrollment", "announcement", etc.
		},
	},
	{ timestamps: true }
);

export const Notification = model<INotification>(
	"Notification",
	notificationSchema
);
