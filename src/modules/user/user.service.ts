import { User } from "./user.model";

const getAllFromDB = async () => {
	const res = await User.find();

	return res;
};
const getInstructors = async () => {
	const res = await User.find({ role: "instructor" });

	return res;
};

export const userServices = { getAllFromDB, getInstructors };
