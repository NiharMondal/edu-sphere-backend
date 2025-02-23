import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { courseServices } from "./course.service";

const createIntoDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await courseServices.createIntoDB(req.body);

	sendResponse(res, {
		statusCode: 201,
		message: "Course created successfully",
		result: result,
	});
});

const getAllFromDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await courseServices.getAllFromDB(req.query as {});

	sendResponse(res, {
		statusCode: 200,
		message: "Course fetched successfully",
		result: result,
	});
});

const getById = asyncHandler(async (req: Request, res: Response) => {
	const result = await courseServices.getById(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Course fetched successfully",
		result: result,
	});
});

const getBySlug = asyncHandler(async (req: Request, res: Response) => {
	const result = await courseServices.getBySlug(req.params.slug);

	sendResponse(res, {
		statusCode: 200,
		message: "Course fetched successfully",
		result: result,
	});
});

const updateDoc = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await courseServices.updateDoc(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Course updated successfully",
		result: result,
	});
});

const deleteDoc = asyncHandler(async (req: Request, res: Response) => {
	const result = await courseServices.deleteDoc(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Course deleted successfully",
		result: result,
	});
});

export const courseController = {
	createIntoDB,
	getAllFromDB,
	getById,
	getBySlug,
	updateDoc,
	deleteDoc,
};
