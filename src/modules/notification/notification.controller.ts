import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { notificationServices } from "./notificcation.service";
import sendResponse from "../../utils/sendResponse";

const getAllFromDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await notificationServices.getAllFromDB();

	sendResponse(res, {
		statusCode: 200,
		message: "Notifications fetched successfully",
		result: result,
	});
});
const getByStudentId = asyncHandler(async (req: Request, res: Response) => {
	const id = req.user.id;
	const result = await notificationServices.getByStudentId(id);

	sendResponse(res, {
		statusCode: 200,
		message: "Notifications fetched successfully by student ID",
		result: result,
	});
});
const markRead = asyncHandler(async (req: Request, res: Response) => {
	const nId = req.params.id;
	const sId = req.user.id;

	const result = await notificationServices.markRead(nId, sId);

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
	getByStudentId,
	markAllRead,
	markRead,
};
