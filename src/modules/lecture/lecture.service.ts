import { generateSlug } from "../../utils";
import CustomError from "../../utils/CustomError";
import { Course } from "../course/course.model";
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

	//actual data
	const data = await Lecture.create(payload);

	//updating course collection
	await Module.findOneAndUpdate(
		{ _id: moduleId },
		{
			$push: {
				lectures: data._id,
			},
		}
	);

	return data;
};

const getAllFromDB = async (query: Record<string, string>) => {
	const { search } = query;
	const data = await Lecture.find().populate("module", "title");

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
