// notification has been created when user enroll the course

import QueryBuilder from "../../lib/QueryBuilder";
import { TQuery } from "../../type";
import { Notification } from "./notification.model";

const getAllFromDB = async () => {
	const notifications = await Notification.find();
	return notifications;
};

const getByUserId = async (id: string, query: TQuery) => {
	const qb = new QueryBuilder(Notification.find({ user: id }), query)
		.pagination()
		.sort();

	const notifications = await qb.getQuery();
	const meta = await qb.countTotal();

	return { meta, notifications };
};

const markRead = async (nId: string, uId: string) => {
	const notification = await Notification.findOneAndUpdate(
		{ _id: nId, user: uId },
		{ isRead: true },
		{ new: true }
	);

	return notification;
};

const markAllRead = async (uId: string) => {
	const notifications = await Notification.updateMany(
		{ user: uId, isRead: false },
		{ isRead: true }
	);

	return notifications;
};

export const notificationServices = {
	getAllFromDB,
	getByUserId,
	markRead,
	markAllRead,
};
