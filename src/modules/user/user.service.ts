import CustomError from "../../utils/CustomError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import QueryBuilder from "../../lib/QueryBuilder";
import { TQuery } from "../../type";
import { Enrollment } from "../enrollment/enrollment.model";

const getAllFromDB = async (query: TQuery) => {
	const res = new QueryBuilder(User.find({ isDeleted: false }), query)
		.search(["name", "email"])
		.filter()
		.pagination()
		.sort()
		.fields()
		.select("name email role phone createdAt avatar");

	const users = await res.getQuery();
	const meta = await res.countTotal();

	return { users, meta };
};

const getUserById = async (id: string) => {
	const user = await User.findById(id).select("-password");

	if (!user || user?.isDeleted === true) {
		throw new CustomError(404, "User not found");
	}
	return user;
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
	const user = await User.findById(id);

	if (!user) {
		throw new CustomError(404, "User not found!");
	}

	if (user.role === "instructor" && payload.role === "student") {
		throw new CustomError(400, "Instructor can not be a student");
	}

	const findEnrollments = await Enrollment.findOne({ student: id });
	if (findEnrollments) {
		throw new CustomError(
			400,
			"Sorry, This user already enrolled a course!"
		);
	}
	const res = await User.findByIdAndUpdate(
		id,
		{ ...payload },
		{ new: true, runValidators: true }
	).select("name email role");
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
	updateDoc,
	updateRole,
	getMyProfile,
};
