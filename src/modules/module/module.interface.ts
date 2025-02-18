import { Types } from "mongoose";

export interface IModule {
	title: string;
	index: number;
	course: Types.ObjectId;
	lectures: Types.ObjectId;
}
