import {
	QueryWithHelpers,
	PopulateOptions,
	Document,
	FilterQuery,
} from "mongoose";
import { PAGE_LIMIT } from "../constant";

class QueryBuilder<T> {
	public queryModel: QueryWithHelpers<T[], T, {}, T>;
	public query: Record<string, string | string[] | unknown>;

	constructor(
		queryModel: QueryWithHelpers<T[], T, {}, T>,
		query: Record<string, string | string[] | unknown>
	) {
		this.queryModel = queryModel;
		this.query = query;
	}

	filter() {
		const queryCopy = { ...this.query };

		const excludedFields = [
			"search",
			"page",
			"limit",
			"sortBy",
			"order",
			"maxBudget",
			"minBudget",
			"fields",
		];
		excludedFields.forEach((field) => delete queryCopy[field]);

		const mongoQuery: Record<string, any> = {};

		Object.entries(queryCopy).forEach(([key, value]) => {
			if (typeof value === "string" && value.includes(",")) {
				// For multi-value filters like category=design,development
				mongoQuery[key] = { $in: value.split(",") };
			} else {
				mongoQuery[key] = value;
			}
		});

		this.queryModel = this.queryModel.find(mongoQuery);

		return this;
	}

	search(searchableFields: string[]) {
		const searchTerm = (this.query?.search as string)?.trim();

		if (searchTerm && searchableFields.length > 0) {
			const regex = new RegExp(searchTerm, "i");

			const orConditions: FilterQuery<T>[] = searchableFields.map(
				(field) => {
					return {
						[field]: { $regex: regex },
					} as FilterQuery<T>;
				}
			);

			this.queryModel = this.queryModel.find({ $or: orConditions });
		}

		return this;
	}

	budget() {
		const min = this.query?.minBudget;
		const max = this.query?.maxBudget;

		if (min || max) {
			this.queryModel = this.queryModel.find({
				budget: {
					...(min ? { $gte: Number(min) } : {}),
					...(max ? { $lte: Number(max) } : {}),
				},
			});
		}

		return this;
	}

	sort() {
		const sortBy = this.query?.sortBy as string;
		const order = this.query?.order === "desc" ? -1 : 1;

		if (sortBy) {
			this.queryModel = this.queryModel.sort({ [sortBy]: order });
		} else {
			this.queryModel = this.queryModel.sort({ createdAt: order });
		}

		return this;
	}

	pagination() {
		const page = Number(this.query?.page) || 1;
		const limit = Number(this.query?.limit) || PAGE_LIMIT;
		const skip = (page - 1) * limit;

		this.queryModel = this.queryModel.skip(skip).limit(limit);

		return this;
	}

	fields() {
		if (this.query?.fields) {
			const fieldString =
				(this.query.fields as string).split(",").join(" ") || "-__v";
			this.queryModel = this.queryModel.select(fieldString);
		}
		return this;
	}

	populate(fields: string | PopulateOptions | (string | PopulateOptions)[]) {
		if (fields) {
			const normalized: (string | PopulateOptions)[] =
				typeof fields === "string" || !Array.isArray(fields)
					? [fields]
					: fields;

			this.queryModel = this.queryModel.populate(normalized);
		}
		return this;
	}

	select(keys: string) {
		this.queryModel = this.queryModel.select(keys);

		return this;
	}

	getQuery() {
		return this.queryModel;
	}

	async countTotal() {
		const filters = this.queryModel.getFilter();
		const totalDocs = await this.queryModel.model.countDocuments(filters);
		const limit = Number(this.query?.limit) || PAGE_LIMIT;
		const currentPage = Number(this.query?.page) || 1;
		const totalPages = Math.ceil(totalDocs / limit);

		return {
			currentPage,
			totalPages,
			totalDocs,
		};
	}
}

export default QueryBuilder;
