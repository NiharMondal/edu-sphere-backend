import { Types } from "mongoose";

export interface IProgress {
	student: Types.ObjectId;
	course: Types.ObjectId;
	progress: number;
	lastWatchedLecture: Types.ObjectId;
	completedLectures: string;
}
