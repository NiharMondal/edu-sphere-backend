import mongoose from "mongoose";
import QueryBuilder from "../../lib/QueryBuilder";
import { generateSlug } from "../../utils";
import CustomError from "../../utils/CustomError";
import { Lecture } from "../lecture/lecture.model";
import { Module } from "../module/module.model";
import { ICourse } from "./course.interface";
import { Course } from "./course.model";
import { User } from "../user/user.model";

const createIntoDB = async (payload: ICourse) => {
	const existedCourse = await Course.findOne({ slug: payload.slug });
	if (existedCourse) {
		throw new CustomError(302, "Course title is already exist!");
	}

	// find instructor
	const instructor = await User.findOne({
		_id: payload.instructor,
		isDeleted: false,
	});

	if (!instructor) {
		throw new CustomError(302, "Instructor does not exist");
	}

	const slug = generateSlug(payload.title);
	const data = await Course.create({ ...payload, slug: slug });

	return data;
};

const getAllFromDB = async (
	query: Record<string, string | string[] | undefined>
) => {
	const res = new QueryBuilder(Course.find(), query)
		.search(["title"])
		.filter();
	const courses = await res.queryModel
		.populate({ path: "instructor", select: "name email" })
		.populate({
			path: "modules",

			populate: {
				path: "lectures",
			},
		});
	return courses;
};

const getById = async (id: string) => {
	const data = await Course.findById(id)
		.populate({ path: "instructor", select: "name email" })
		.populate({
			path: "modules",

			populate: {
				path: "lectures",
			},
		});
	if (!data) {
		throw new CustomError(404, "Course not found!");
	}
	return data;
};

const getBySlug = async (slug: string) => {
	const data = await Course.findOne({ slug }).populate({
		path: "modules",
		select: "title",
	});
	if (!data) {
		throw new CustomError(404, "Course not found!");
	}
	return data;
};

const updateDoc = async (id: string, payload: Partial<ICourse>) => {
	const res = await Course.findById(id);
	if (!res) {
		throw new CustomError(404, "Course not found!");
	}
	const slug = generateSlug(payload.title as string);

	const data = await Course.findByIdAndUpdate(
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
	// start session
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		//first transaction -> find course
		const course = await Course.findById(id).session(session);
		if (!course) {
			await session.abortTransaction();
			session.endSession();
			throw new CustomError(404, "Course not found!");
		}

		//second transaction -> find all modules
		const modules = await Module.find({ course: id }).session(session);
		const moduleIds = modules.map((module) => module._id);

		// third transaction -> Delete all lectures
		await Lecture.updateMany(
			{ module: { $in: moduleIds } },
			{
				$set: {
					isDeleted: true,
				},
			}
		).session(session);

		// forth transaction -> Delete all modules
		await Module.updateMany(
			{ course: { $in: id } },
			{
				$set: {
					isDeleted: true,
				},
			}
		).session(session);

		// fifth transaction -> Delete course itself
		const res = await Course.findByIdAndUpdate(
			{ _id: id },
			{
				$set: {
					isDeleted: true,
				},
			},
			{ new: true }
		).session(session);

		//commit transaction
		await session.commitTransaction();
		session.endSession();

		return res;
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		throw new CustomError(400, "Could not delete course");
	}
};

export const courseServices = {
	createIntoDB,
	getAllFromDB,
	getById,
	getBySlug,
	updateDoc,
	deleteDoc,
};
