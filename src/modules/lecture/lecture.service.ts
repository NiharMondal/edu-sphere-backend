import mongoose from "mongoose";
import CustomError from "../../utils/CustomError";
import { Module } from "../module/module.model";
import { ILecture } from "./lecture.interface";
import { Lecture } from "./lecture.model";

const createIntoDB = async (moduleId: string, payload: ILecture) => {
	// double checking by moduleId and params
	const module = await Module.findOne({
		$and: [{ _id: moduleId }, { _id: payload.module }],
	});

	if (!module) {
		throw new CustomError(404, "Requested module is not found!");
	}

	// checking Lecture exist or not
	const existedLecture = await Lecture.findOne({ title: payload.title });

	if (existedLecture) {
		throw new CustomError(302, "Lecture title is already exist!");
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const newLecture = new Lecture(payload);
		await newLecture.save({ session }); // first transaction -> create lecture

		//second tran -> update module collection
		const updateModule = await Module.findOneAndUpdate(
			{ _id: moduleId },
			{
				$push: {
					lectures: newLecture._id,
				},
			},
			{ new: true }
		).session(session);

		if (!updateModule) {
			await session.abortTransaction();
			session.endSession();
			throw new CustomError(
				400,
				"Failed to update module with new lecture"
			);
		}

		//commit session
		await session.commitTransaction();
		session.endSession();

		return newLecture;
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.log(error);
		throw new CustomError(500, "Could not create lecture");
	}
};

const getAllFromDB = async (query: Record<string, string>) => {
	const data = await Lecture.find().populate({
		path: "module",
		select: "title course",
		populate: {
			path: "course",
			select: "title",
		},
	});

	return data;
};

const getById = async (id: string) => {
	const data = await Lecture.findById(id);
	if (!data) {
		throw new CustomError(404, "Lecture not found!");
	}
	return data;
};

const updateDoc = async (id: string, payload: Partial<ILecture>) => {
	const res = await Lecture.findById(id);
	if (!res) {
		throw new CustomError(404, "Lecture not found!");
	}
	const data = await Lecture.findByIdAndUpdate(
		{ _id: id },
		{
			$set: {
				...payload,
			},
		},
		{ new: true, runValidators: true }
	);

	return data;
};

const deleteDoc = async (id: string) => {
	const lecture = await Lecture.findById(id);
	if (!lecture) {
		throw new CustomError(404, "Lecture not found!");
	}

	//updating lectures field from module collection
	await Module.findByIdAndUpdate(lecture.module, { $pull: { lectures: id } });
	const data = await Lecture.findByIdAndDelete(id);

	return data;
};

export const lectureServices = {
	createIntoDB,
	getAllFromDB,
	getById,

	updateDoc,
	deleteDoc,
};
