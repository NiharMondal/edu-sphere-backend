import { generateSlug } from "../../utils";
import CustomError from "../../utils/CustomError";
import { Course } from "../course/course.model";
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

const getAllFromDB = async () => {
	const data = await Module.find();

	return data;
};

const getById = async (id: string) => {
	const data = await Module.findById(id);
	if (!data) {
		throw new CustomError(404, "Module not found!");
	}
	return data;
};

const getBySlug = async (slug: string) => {
	const data = await Module.findOne({ slug });
	if (!data) {
		throw new CustomError(404, "Module not found!");
	}
	return data;
};

const updateDoc = async (id: string, payload: Partial<IModule>) => {
	const res = await Module.findById(id);
	if (!res) {
		throw new CustomError(404, "Module not found!");
	}
	const slug = generateSlug(payload?.title as string);
	const data = await Module.findByIdAndUpdate(
		{ _id: id },
		{
			$set: {
				...payload,
				slug: slug,
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
	const data = await Module.findByIdAndDelete(id);

	return data;
};

export const moduleServices = {
	createIntoDB,
	getAllFromDB,
	getById,
	getBySlug,
	updateDoc,
	deleteDoc,
};
