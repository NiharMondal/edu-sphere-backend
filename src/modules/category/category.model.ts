import { model, Schema } from "mongoose";
import { ICategory } from "./category.interface";

const categorySchema = new Schema<ICategory>({
	name: {
		type: String,
		required: [true, "Category name is required"],
		unique: true,
	},
	slug: {
		type: String,
		unique: [true, "Slug should be unique"],
	}, // will be auto generated
	icon: String,

	isDeleted: {
		type: Boolean,
		default: false,
	},
});

export const Category = model<ICategory>("Category", categorySchema);
