import { generateSlug } from "../../utils";
import CustomError from "../../utils/CustomError";
import { Lecture } from "../lecture/lecture.model";
import { Module } from "../module/module.model";
import { ICourse } from "./course.interface";
import { Course } from "./course.model";

const createIntoDB = async (payload: ICourse) => {
	const existedCourse = await Course.findOne({ slug: payload.slug });
	if (existedCourse) {
		throw new CustomError(302, "Course title is already exist!");
	}

	const slug = generateSlug(payload?.title);
	const data = await Course.create({ ...payload, slug: slug });

	return data;
};

const getAllFromDB = async () => {
	const data = await Course.find().populate({
		path: "modules",
		populate: {
			path: "lectures",
		},
	});

	return data;
};

const getById = async (id: string) => {
	const data = await Course.findById(id).populate({ path: "modules" });
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
	const slug = generateSlug(payload?.title as string);
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
	const course = await Course.findById(id);
	if (!course) {
		throw new CustomError(404, "Course not found!");
	}

	const module = await Module.find({ course: id });
	module.forEach(
		async (val) => await Lecture.deleteMany({ module: val._id })
	);
	await Lecture.deleteMany({ module: module });
	await Module.deleteMany({ course: id });
	const data = await Course.findByIdAndDelete(id);

	return data;
};

export const courseServices = {
	createIntoDB,
	getAllFromDB,
	getById,
	getBySlug,
	updateDoc,
	deleteDoc,
};
