import { User } from "./user.model";

const getAllFromDB = async () => {
	const res = await User.find().select("-password");

	return res;
};
const getUserById = async (id: string) => {
	const res = await User.findById(id)
		.select("-password")
		.populate({
			path: "enrolledCourses",
			select: "course progress",
			populate: {
				path: "course",
				select: "title price",
			},
		})
		.populate({
			path: "createdCourses",
		});

	return res;
};

const getInstructors = async () => {
	const res = await User.find({
		role: "instructor",
		isDeleted: false,
	}).select("name email role");

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
	return res;
};

export const userServices = {
	getAllFromDB,
	getUserById,
	getInstructors,
	updateRole,
};
