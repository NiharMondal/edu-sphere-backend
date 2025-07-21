import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { moduleServices } from "./module.service";
import { TQuery } from "../../type";

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
	const result = await moduleServices.getAllFromDB(req.query as {});

	sendResponse(res, {
		statusCode: 200,
		message: "Module fetched successfully",
		result: result.modules,
		meta: result.meta,
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

const getByCourseId = asyncHandler(async (req: Request, res: Response) => {
	const result = await moduleServices.getByCourseId(req.params.courseId);

	sendResponse(res, {
		statusCode: 200,
		message: "Module fetched successfully by course ID",
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
const assignedModuleToInstructor = asyncHandler(
	async (req: Request, res: Response) => {
		const user = req.user;
		const result = await moduleServices.assignedModuleToInstructor(
			user.id,
			req.query as TQuery
		);

		sendResponse(res, {
			statusCode: 200,
			message: "Module fetched by instructor successfully",
			result: result.modules,
			meta: result?.meta,
		});
	}
);

export const moduleController = {
	createIntoDB,
	getAllFromDB,
	getById,
	getByCourseId,

	updateDoc,
	deleteDoc,

	assignedModuleToInstructor,
};
