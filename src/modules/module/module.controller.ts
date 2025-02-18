import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { moduleServices } from "./module.service";

const createIntoDB = asyncHandler(async (req: Request, res: Response) => {
	const { courseId } = req.params;
	const result = await moduleServices.createIntoDB(courseId, req.body);

	sendResponse(res, {
		statusCode: 201,
		message: "Module created successfully",
		result: result,
	});
});

const getAllFromDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await moduleServices.getAllFromDB();

	sendResponse(res, {
		statusCode: 200,
		message: "Module fetched successfully",
		result: result,
	});
});

const getById = asyncHandler(async (req: Request, res: Response) => {
	const result = await moduleServices.getById(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Module fetched successfully",
		result: result,
	});
});

const getBySlug = asyncHandler(async (req: Request, res: Response) => {
	const result = await moduleServices.getBySlug(req.params.slug);

	sendResponse(res, {
		statusCode: 200,
		message: "Module fetched successfully",
		result: result,
	});
});

const updateDoc = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await moduleServices.updateDoc(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Module updated successfully",
		result: result,
	});
});

const deleteDoc = asyncHandler(async (req: Request, res: Response) => {
	const result = await moduleServices.deleteDoc(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Module deleted successfully",
		result: result,
	});
});

export const moduleController = {
	createIntoDB,
	getAllFromDB,
	getById,
	getBySlug,
	updateDoc,
	deleteDoc,
};
