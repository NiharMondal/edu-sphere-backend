import QueryBuilder from "../../lib/QueryBuilder";
import { TQuery } from "../../type";
import { generateSlug } from "../../utils";
import CustomError from "../../utils/CustomError";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";

const createIntoDB = async (payload: ICategory) => {
	const slug = generateSlug(payload.name);

	const data = await Category.create({ ...payload, slug });

	return data;
};

const getAllFromDB = async (query: TQuery) => {
	const data = await Category.aggregate([
		// Match by name with case-insensitive regex
		{
			$match: {
				isDeleted: false,
				// name: { $regex: `${query.search}`, $options: "i" },
			},
		},

		// Lookup related courses
		{
			$lookup: {
				from: "courses",
				localField: "_id",
				foreignField: "category",
				as: "courses",
			},
		},

		// Add field for course count
		{
			$addFields: {
				courseCount: { $size: "$courses" },
			},
		},

		// Optionally exclude the full courses array
		{
			$project: {
				courses: 0,
			},
		},
	]);

	return data;
};
const getById = async (id: string) => {
	const data = await Category.findById(id);

	return data;
};
const getBySlug = async (slug: string) => {
	const data = await Category.findOne({ slug: slug });

	return data;
};

const updateDoc = async (id: string, payload: Partial<ICategory>) => {
	const category = await Category.findById(id);

	if (!category) {
		throw new CustomError(404, "Data not found");
	}

	const slug = generateSlug(payload.name || category.name);

	const updatedCategory = await Category.findByIdAndUpdate(
		id,
		{
			$set: {
				...payload,
				slug: slug,
			},
		},
		{ new: true, runValidators: true }
	);

	return updatedCategory;
};

const deleteDoc = async (id: string) => {
	const category = await Category.findById(id);
	if (!category) {
		throw new CustomError(404, "Data not found");
	}

	const data = await Category.findByIdAndUpdate(
		id,
		{ $set: { isDeleted: true } },
		{ new: true }
	);
	return data;
};

export const categoryServices = {
	createIntoDB,
	getAllFromDB,
	getById,
	getBySlug,
	updateDoc,
	deleteDoc,
};
