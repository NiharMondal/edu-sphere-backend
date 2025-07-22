import mongoose from "mongoose";
import CustomError from "../../utils/CustomError";
import { Course } from "../course/course.model";
import { Lecture } from "../lecture/lecture.model";
import { IModule } from "./module.interface";
import { Module } from "./module.model";
import { generateSlug } from "../../utils";
import { Enrollment } from "../enrollment/enrollment.model";
import { Notification } from "../notification/notification.model";
import { getIO } from "../../socket";
import QueryBuilder from "../../lib/QueryBuilder";
import { TQuery } from "../../type";

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
		const module = new Module({
			...payload,
			index: newIndex,
		});
		await module.save({ session }); //first step

		const enrollments = await Enrollment.find({
			course: payload.course,
		}).session(session); // second step: this step is for creating notification

		for (const enrollment of enrollments) {
			const notification = new Notification({
				user: enrollment.student,
				message: `Module ${module.index}: ${module.title} has been released`,
				type: "module-update",
			});

			await notification.save({ session }); // third step: saving notifications

			const io = getIO();

			io.to(enrollment.student.toString()).emit(
				"new-notification",
				notification
			);
		}
		await Course.findByIdAndUpdate(
			{ _id: module.course },
			{
				$push: {
					modules: module._id,
				},
			},
			{ new: true, runValidators: true }
		).session(session); // forth step: saving modules to course model

		await session.commitTransaction();
		await session.endSession();

		return module;
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		console.log(error);
		throw new CustomError(400, "Could not create module");
	}
};

const getAllFromDB = async (query: Record<string, string>) => {
	const queryBuilder = new QueryBuilder(Module.find(), query)
		.search(["title"])
		.sort()
		.pagination()
		.fields()
		.populate({
			path: "course",
			select: "title",
		})
		.populate("lectures");

	const modules = await queryBuilder.getQuery();
	const meta = await queryBuilder.countTotal();

	return { modules, meta };
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

const assignedModuleToInstructor = async (insId: string, query: TQuery) => {
	const courses = await Course.find({ instructor: insId });
	const courseIds = courses.map((c) => c._id);

	const qb = new QueryBuilder(
		Module.find({ course: { $in: courseIds } }),
		query
	)
		.search(["title"])
		.sort()
		.pagination()
		.fields()
		.populate([{ path: "course", select: "title" }, { path: "lectures" }]);

	const modules = await qb.getQuery();
	const meta = await qb.countTotal();
	return { modules, meta };
};
export const moduleServices = {
	createIntoDB,
	getAllFromDB,
	getById,
	getByCourseId,

	updateDoc,
	deleteDoc,

	assignedModuleToInstructor,
};
