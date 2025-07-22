import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";

import sendResponse from "../../utils/sendResponse";
import { notificationServices } from "./notification.service";
import { TQuery } from "../../type";

const getAllFromDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await notificationServices.getAllFromDB();

	sendResponse(res, {
		statusCode: 200,
		message: "Notifications fetched successfully",
		result: result,
	});
});
const getByUserId = asyncHandler(async (req: Request, res: Response) => {
	const id = req.user.id;
	const result = await notificationServices.getByUserId(
		id,
		req.query as TQuery
	);

	sendResponse(res, {
		statusCode: 200,
		message: "Notifications fetched successfully by student ID",
		result: result.notifications,
		meta: result.meta,
	});
});
const markRead = asyncHandler(async (req: Request, res: Response) => {
	const nId = req.params.id;
	const uId = req.user.id;

	const result = await notificationServices.markRead(nId, uId);

	sendResponse(res, {
		statusCode: 200,
		message: "Notification marked as read",
		result: result,
	});
});
const markAllRead = asyncHandler(async (req: Request, res: Response) => {
	const id = req.user.id;
	const result = await notificationServices.markAllRead(id);

	sendResponse(res, {
		statusCode: 200,
		message: "Notifications marked as read",
		result: result,
	});
});

export const notificationController = {
	getAllFromDB,
	getByUserId,
	markAllRead,
	markRead,
};
