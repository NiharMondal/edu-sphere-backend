import mongoose from "mongoose";
import QueryBuilder from "../../lib/QueryBuilder";
import { generateSlug } from "../../utils";
import CustomError from "../../utils/CustomError";
import { Lecture } from "../lecture/lecture.model";
import { Module } from "../module/module.model";
import { ICourse } from "./course.interface";
import { Course } from "./course.model";
import { User } from "../user/user.model";
import { TQuery } from "../../type";
import { Notification } from "../notification/notification.model";
import { getIO } from "../../socket";

const createIntoDB = async (payload: ICourse) => {
	const existedCourse = await Course.findOne({ title: payload.title });

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

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const course = new Course({
			...payload,
			slug: slug,
		});

		const notification = new Notification({
			user: course.instructor,
			message: `You have been assigned to ${course.title}`,
			type: "assigned-as-instructor",
		});

		await course.save({ session });
		await notification.save({ session });

		const io = getIO();
		io.to(course.instructor.toString()).emit(
			"new-notification",
			notification
		);

		await session.commitTransaction();
		await session.endSession();
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		console.log(error);
		throw new CustomError(400, "Could not create course");
	}
};

const getAllFromDB = async (query: TQuery) => {
	const res = new QueryBuilder(Course.find({ isDeleted: false }), query)
		.search(["title", "level", "pricingType"])
		.filter()
		.populate({ path: "instructor", select: "name" })
		.sort();
	const courses = await res.getQuery();
	const meta = await res.countTotal();
	return { meta, courses };
};

const getById = async (id: string) => {
	const data = await Course.findById(id)
		.populate({ path: "instructor", select: "name avatar" })
		.populate({ path: "category", select: "name" })
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
	const result = await Course.aggregate([
		{ $match: { slug: slug } },

		{
			$lookup: {
				from: "users",
				localField: "instructor",
				foreignField: "_id",
				as: "instructor",
				pipeline: [
					{ $project: { name: 1, avatar: 1 } }, // Only include name and avatar
				],
			},
		},
		// Get all modules of this course
		{
			$lookup: {
				from: "modules",
				let: { courseId: "$_id" },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ["$course", "$$courseId"] },
						},
					},
					{ $sort: { index: 1 } },

					// Lookup lectures inside each module
					{
						$lookup: {
							from: "lectures",
							let: { moduleId: "$_id" },
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: ["$module", "$$moduleId"],
										},
									},
								},
								{
									$project: {
										title: 1,
										content: 1,
										type: 1,
										duration: 1,
									},
								},
							],
							as: "lectures",
						},
					},
					{
						$project: {
							title: 1,
							index: 1,
							lectures: 1,
						},
					},
				],
				as: "modules",
			},
		},

		// Add total lecture count across all modules
		{
			$addFields: {
				totalLectures: {
					$sum: {
						$map: {
							input: "$modules",
							as: "mod",
							in: { $size: "$$mod.lectures" },
						},
					},
				},
				totalModules: { $size: "$modules" },
			},
		},

		{
			$project: {
				title: 1,
				price: 1,
				description: 1,
				thumbnail: 1,
				instructor: { $arrayElemAt: ["$instructor", 0] },
				modules: 1,
				totalModules: 1,
				totalLectures: 1,
			},
		},
	]);

	return result[0];
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

const popularCourses = async () => {
	const courses = await Course.find({ rating: { $gte: 3 } });

	return courses;
};

const getCoursesByInstructorId = async (id: string) => {
	const courses = await Course.find({ instructor: id });

	return courses;
};
export const courseServices = {
	createIntoDB,
	getAllFromDB,
	getById,
	getBySlug,
	updateDoc,
	deleteDoc,

	popularCourses,
	getCoursesByInstructorId,
};
