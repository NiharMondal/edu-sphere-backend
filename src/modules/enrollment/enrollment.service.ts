import mongoose from "mongoose";
import CustomError from "../../utils/CustomError";
import { Course } from "../course/course.model";
import { IEnrollment } from "./enrollment.interface";
import { Enrollment } from "./enrollment.model";
import { User } from "../user/user.model";
import QueryBuilder from "../../lib/QueryBuilder";

const createIntoDB = async (payload: IEnrollment) => {
	const course = await Course.findById(payload.course);
	if (!course) {
		throw new CustomError(404, "Course not found!");
	}
	const student = await User.findById(payload.student);
	if (!student) {
		throw new CustomError(404, "Student not found!");
	}

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const data = new Enrollment(payload);
		await data.save({ session });

		await Course.findByIdAndUpdate(data.course, {
			$push: {
				students: data.student,
			},
		}).session(session);

		await User.findByIdAndUpdate(data.student, {
			$push: {
				enrolledCourses: data._id,
			},
		}).session(session);

		await session.commitTransaction();
		session.endSession();

		return data;
	} catch (error) {
		await session.commitTransaction();
		session.endSession();
		throw new CustomError(400, "Could not enrolled course");
	}
};

const getAllFromDB = async (
	query: Record<string, string | string[] | undefined>
) => {
	console.log(query);
	const res = new QueryBuilder(Enrollment.find(), query);

	const data = await res.queryModel;

	return data;
};

const myEnrollment = async (id: string) => {
	const res = await Enrollment.find({ student: id }).populate({
		path: "course",
		select: "slug title thumbnail",
	});

	return res;
};

export const enrollmentServices = { createIntoDB, getAllFromDB, myEnrollment };
