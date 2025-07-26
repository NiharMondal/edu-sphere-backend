import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";
import { TQuery } from "../../type";

const getAllFromDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await userServices.getAllFromDB(req.query as TQuery);

	sendResponse(res, {
		statusCode: 200,
		message: "User fetched successfully",
		meta: result?.meta,
		result: result.users,
	});
});

const getUserById = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await userServices.getUserById(id);

	sendResponse(res, {
		statusCode: 200,
		message: "User fetched successfully",
		result: result,
	});
});

const updateDoc = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await userServices.updateDoc(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "User updated successfully",
		result: result,
	});
});
const updateRole = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await userServices.updateRole(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "User role is updated successfully",
		result: result,
	});
});
const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
	const user = req.user;
	const result = await userServices.getMyProfile(user?.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Profile found",
		result: result,
	});
});

export const userController = {
	getAllFromDB,
	getUserById,
	updateDoc,
	updateRole,
	getMyProfile,
};
