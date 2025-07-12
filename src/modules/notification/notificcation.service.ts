// notification has been created when user enroll the course

import { Notification } from "./notification.model";

const getAllFromDB = async () => {
	const notifications = await Notification.find();
	return notifications;
};

const getByStudentId = async (sId: string) => {
	const notifications = await Notification.find({ student: sId }).sort({
		createdAt: -1,
	});

	return notifications;
};

const markRead = async (nId: string, sId: string) => {
	const notification = await Notification.findOneAndUpdate(
		{ _id: nId, student: sId },
		{ isRead: true },
		{ new: true }
	);

	return notification;
};

const markAllRead = async (sId: string) => {
	const notifications = await Notification.updateMany(
		{ student: sId, isRead: false },
		{ isRead: true }
	);

	return notifications;
};

export const notificationServices = {
	getAllFromDB,
	getByStudentId,
	markRead,
	markAllRead,
};
