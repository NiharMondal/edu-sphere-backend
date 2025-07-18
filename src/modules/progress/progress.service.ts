import { Types } from "mongoose";
import CustomError from "../../utils/CustomError";

import { ILecture } from "../lecture/lecture.interface";
import { Lecture } from "../lecture/lecture.model";
import { IModule } from "../module/module.interface";
import { Progress } from "./progress.model";
import { Module } from "../module/module.model";
import QueryBuilder from "../../lib/QueryBuilder";

const getAllFromDB = async (query: Record<string, string>) => {
	const data = new QueryBuilder(Progress.find(), query);
	const progress = await data.queryModel;
	return progress;
};
const getProgressByStudentId = async (studentId: string) => {
	const data = await Progress.find({ student: studentId });

	if (!data) {
		throw new CustomError(404, "Progress data not found");
	}

	return data;
};
const getProgressByStudentIdAndCourseId = async (
	studentId: string,
	courseId: string
) => {
	const data = await Progress.findOne({
		student: studentId,
		course: courseId,
	});

	if (!data) {
		throw new CustomError(404, "Progress data not found");
	}

	return data;
};
/**
 *
 * @param courseId
 * @param studentId
 * @param lectureId
 * @returns
 */
type PopulatedModule = IModule[] & {
	lectures: ILecture[];
};

const markLectureComplete = async (
	courseId: string,
	studentId: string,
	lectureId: string
) => {
	const lecture = await Lecture.findById(lectureId);
	if (!lecture) {
		throw new CustomError(404, "Lecture not found!");
	}

	const progress = await Progress.findOne({
		course: courseId,
		student: studentId,
	});

	if (!progress) {
		throw new CustomError(404, "Course or student ID not found!");
	}

	// 1. Get all modules for the course sorted by index
	const modules = await Module.find({ course: courseId }).populate({
		path: "lectures",
		model: "Lecture",
	});

	let totalLectures = 0;

	if (modules as unknown as PopulatedModule[]) {
		const lect = modules.flatMap((lec) => lec.lectures);
		totalLectures += lect.length;
	}

	if (totalLectures === 0) {
		throw new CustomError(400, "Course has no lectures");
	}

	if (!progress.completedLectures.includes(lectureId)) {
		(progress.completedLectures as unknown as string[]).push(lectureId);
	}

	// updating lastWatchedLecture
	progress.lastWatchedLecture = lectureId as unknown as Types.ObjectId;

	const completedCount = progress.completedLectures.length; // counting completed lecture length
	progress.progress = Math.round((completedCount / totalLectures) * 100); // calculating percentage %

	await progress.save();

	return progress;
};

export const progressServices = {
	getAllFromDB,
	getProgressByStudentId,
	getProgressByStudentIdAndCourseId,
	markLectureComplete,
};
