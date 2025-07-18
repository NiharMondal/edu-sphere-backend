import CustomError from "../../utils/CustomError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import QueryBuilder from "../../lib/QueryBuilder";

const getAllFromDB = async (query: Record<string, string>) => {
	const res = new QueryBuilder(User.find(), query)
		.search(["name"])
		.filter()
		.fields();
	const users = await res.queryModel.select("-password");

	return users;
};

const getUserById = async (id: string) => {
	const user = await User.findById(id).select("-password");

	if (!user || user?.isDeleted === true) {
		throw new CustomError(404, "User not found");
	}
	return user;
};

const getInstructors = async () => {
	const res = await User.find({
		role: "instructor",
		isDeleted: false,
	}).select("name email role");

	return res;
};

const updateDoc = async (
	id: string,
	payload: Pick<IUser, "name" | "avatar" | "phone">
) => {
	const res = await User.findByIdAndUpdate(
		id,
		{
			$set: {
				...payload,
			},
		},
		{ new: true, runValidators: true }
	).select("name email avatar phone");

	if (!res) {
		throw new CustomError(404, "User not found");
	}
	return res;
};

const updateRole = async (id: string, payload: { role: string }) => {
	const res = await User.findByIdAndUpdate(
		id,
		{
			$set: {
				...payload,
			},
		},
		{ new: true, runValidators: true }
	).select("name email role");

	if (!res) {
		throw new CustomError(404, "User not found!");
	}
	return res;
};

const getMyProfile = async (id: string) => {
	const user = await User.findById(id).select("name role avatar");
	if (!user) {
		throw new CustomError(404, "User not found!");
	}
	return user;
};

export const userServices = {
	getAllFromDB,
	getUserById,
	getInstructors,
	updateDoc,
	updateRole,

	getMyProfile,
};
