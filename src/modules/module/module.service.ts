import CustomError from "../../utils/CustomError";
import { Course } from "../course/course.model";
import { Lecture } from "../lecture/lecture.model";
import { IModule } from "./module.interface";
import { Module } from "./module.model";

const createIntoDB = async (courseId: string, payload: IModule) => {
	// double checking by courseId and params
	const course = await Course.findOne({
		$and: [{ _id: courseId }, { _id: payload.course }],
	});

	if (!course) {
		throw new CustomError(404, "Requested course is not found!");
	}

	// checking module exist or not
	const existedModule = await Module.findOne({ title: payload.title });

	if (existedModule) {
		throw new CustomError(302, "Module title is already exist!");
	}

	//actual data
	const data = await Module.create(payload);

	//updating course collection
	await Course.findOneAndUpdate(
		{ _id: courseId },
		{
			$push: {
				modules: data._id,
			},
		}
	);

	return data;
};

const getAllFromDB = async (query: Record<string, string>) => {
	const { search } = query;

	const modules = await Module.find()
		.populate({
			path: "course",
			select: "title",
		})
		.populate({
			path: "lectures",
		})
		.sort({ createdat: "desc" });

	return modules;
};

const getById = async (id: string) => {
	const data = await Module.findById(id).populate({ path: "lectures" });
	if (!data) {
		throw new CustomError(404, "Module not found!");
	}
	return data;
};

const updateDoc = async (id: string, payload: Partial<IModule>) => {
	const module = await Module.findById(id);
	if (!module) {
		throw new CustomError(404, "Module not found!");
	}

	const data = await Module.findByIdAndUpdate(
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
	const res = await Module.findById(id);
	if (!res) {
		throw new CustomError(404, "Module not found!");
	}

	//delete lectures based on module id
	await Lecture.deleteMany({ module: id }); // id refers to module id
	//updating course module array
	await Course.findByIdAndUpdate(res.course, { $pull: { modules: id } });

	//deleting module
	const data = await Module.findByIdAndDelete(id);

	return data;
};

export const moduleServices = {
	createIntoDB,
	getAllFromDB,
	getById,

	updateDoc,
	deleteDoc,
};
