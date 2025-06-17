import mongoose from "mongoose";
import CustomError from "../../utils/CustomError";
import { Course } from "../course/course.model";
import { Lecture } from "../lecture/lecture.model";
import { IModule } from "./module.interface";
import { Module } from "./module.model";
import { generateSlug } from "../../utils";

const createIntoDB = async (courseId: string, payload: IModule) => {
	// double checking by courseId and params
	const course = await Course.findOne({
		$and: [{ _id: courseId }, { _id: payload.course }],
	});

	if (!course) {
		throw new CustomError(404, "Requested course is not found!");
	}

	const module = await Module.findOne({
		title: payload.title,
		course: payload.course,
	});

	if (module) {
		throw new CustomError(400, "Title should be unique");
	}
	const lastModule = await Module.findOne({ course: payload.course }).sort({
		index: -1,
	});
	const newIndex = lastModule ? lastModule.index + 1 : 1;

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		//first transaction -> creating module
		const slug = generateSlug(payload.title); //generating slug
		const newModule = new Module({ ...payload, slug, index: newIndex });
		await newModule.save({ session });

		//second transaction -> updating course collection
		const updateResult = await Course.findOneAndUpdate(
			{ _id: courseId },
			{
				$push: {
					modules: newModule._id,
				},
			},
			{ session, new: true }
		);

		// If course update failed, abort transaction
		if (!updateResult) {
			await session.abortTransaction();
			session.endSession();
			throw new CustomError(
				400,
				"Failed to update course with new module"
			);
		}

		//commit session
		await session.commitTransaction();
		session.endSession();

		return newModule;
	} catch (error) {
		await session.abortTransaction();
		session.endSession();

		throw new CustomError(500, "Could not create module");
	}
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
		.sort({ createdAt: "desc" });

	return modules;
};

const getById = async (id: string) => {
	const data = await Module.findById(id).populate({ path: "lectures" });
	if (!data) {
		throw new CustomError(404, "Module not found!");
	}
	return data;
};

// by course Id
const getByCourseId = async (id: string) => {
	const data = await Module.find({ course: id });
	if (!data) {
		throw new CustomError(404, "Course not found!");
	}
	return data;
};

const updateDoc = async (id: string, payload: Partial<IModule>) => {
	const module = await Module.findById(id);
	if (!module) {
		throw new CustomError(404, "Module not found!");
	}
	const slug = generateSlug(payload?.title as string);
	const data = await Module.findByIdAndUpdate(
		{ _id: id },
		{
			$set: {
				...payload,
				slug,
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

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		//delete lectures based on module id
		await Lecture.deleteMany({ module: id }).session(session); // id refers to module id
		//updating course module array
		await Course.findByIdAndUpdate(res.course, {
			$pull: { modules: id },
		}).session(session);
		//deleting module
		const data = await Module.findByIdAndDelete(id).session(session);

		//commit session
		await session.commitTransaction();
		session.endSession();

		return data;
	} catch (error) {
		await session.abortTransaction();
		session.endSession();

		throw new CustomError(500, "Could not delete module");
	}
};

export const moduleServices = {
	createIntoDB,
	getAllFromDB,
	getById,
	getByCourseId,

	updateDoc,
	deleteDoc,
};
