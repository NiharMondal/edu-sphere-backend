import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { categoryServices } from "./category.service";
import { TQuery } from "../../type";

const createIntoDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await categoryServices.createIntoDB(req.body);

	sendResponse(res, {
		statusCode: 201,
		message: "Category created successfully",
		result: result,
	});
});

const getAllFromDB = asyncHandler(async (req: Request, res: Response) => {
	const query = req.query;
	const result = await categoryServices.getAllFromDB(query as TQuery);

	sendResponse(res, {
		statusCode: 200,
		message: "Category fetched successfully",
		result: result,
	});
});

const getById = asyncHandler(async (req: Request, res: Response) => {
	const result = await categoryServices.getById(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Category fetched successfully",
		result: result,
	});
});

const getBySlug = asyncHandler(async (req: Request, res: Response) => {
	const result = await categoryServices.getBySlug(req.params.slug);

	sendResponse(res, {
		statusCode: 200,
		message: "Category fetched successfully",
		result: result,
	});
});

const updateDoc = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await categoryServices.updateDoc(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Category updated successfully",
		result: result,
	});
});

const deleteDoc = asyncHandler(async (req: Request, res: Response) => {
	const result = await categoryServices.deleteDoc(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Category deleted successfully",
		result: result,
	});
});

export const categoryController = {
	createIntoDB,
	getAllFromDB,
	getById,
	getBySlug,
	updateDoc,
	deleteDoc,
};
