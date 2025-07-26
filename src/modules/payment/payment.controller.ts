import express, { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { paymentServices } from "./payment.service";
import sendResponse from "../../utils/sendResponse";
import { TQuery } from "../../type";

const createIntoDB = asyncHandler(async (req: Request, res: Response) => {
	const sig = req.headers["stripe-signature"];
	const data = await paymentServices.createIntoDB(req.body, sig);

	sendResponse(res, {
		statusCode: 201,
		message: "Payment created successfully",
		result: data,
	});
});

const getAllFromDB = asyncHandler(async (req: Request, res: Response) => {
	const query = req.query;
	const data = await paymentServices.getAllFromDB(query as TQuery);

	sendResponse(res, {
		statusCode: 200,
		message: "Payment fetched successfully",
		meta: data.meta,
		result: data.paymentHistory,
	});
});

export const paymentController = { createIntoDB, getAllFromDB };
