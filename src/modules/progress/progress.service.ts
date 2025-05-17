import CustomError from "../../utils/CustomError";
import { Progress } from "./progress.model";


/**
 *
 * @param courseId
 * @param studentId
 * @param lectureId
 * @returns
 */


const markLectureComplete = async (
	courseId: string,
	studentId: string,
	lectureId: string
) => {

	const progress = await Progress.findOne({
		course: courseId,
		student: studentId,
	});

	if (!progress) {
		throw new CustomError(404, "Course or student ID not found!");
	}

	const res = await Progress.findOneAndUpdate(
		{ course: courseId, student: studentId },
		{ $push: { completedLectures: lectureId } },
		{ new: true, runValidators: true }
	);

	return res;
};

export const progressServices = {
	markLectureComplete,
};
