import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
	public queryModel: Query<T[], T>;
	public query: Record<string, string | string[] | unknown>;

	constructor(
		queryModel: Query<T[], T>,
		query: Record<string, string | string[] | unknown>
	) {
		this.queryModel = queryModel;
		this.query = query;
	}

	filter() {
		const queryCopy = { ...this.query };
		queryCopy["isDeleted"] = false;

		const exludedFields = [
			"search",
			"page",
			"limit",
			"sortBy",
			"order",
			"maxBudget",
			"minBudget",
			"fields",
		];

		// deleting item from main query
		exludedFields.forEach((field) => delete queryCopy[field]);

		if (this.query) {
			this.queryModel = this.queryModel.find(queryCopy);
		}
		return this;
	}
	search(searchableFields: string[]) {
		if (this?.query?.search) {
			this.queryModel = this.queryModel.find({
				$or: searchableFields.map(
					(field) =>
						({
							[field]: {
								$regex: this?.query?.search,
								$options: "i",
							},
						} as FilterQuery<T>)
				),
			});
		}
		return this;
	}

	budget() {
		const minPrice = Number(this?.query?.minBudget) || 0;
		const maxPrice = Number(this?.query?.maxBudget) || 12000;
		if (minPrice || maxPrice) {
			this.queryModel = this.queryModel.find({
				budget: { $gte: minPrice, $lte: maxPrice },
			});
		}
		return this;
	}

	sort() {
		const sortBy = this.query?.sortBy || "createdAt";
		const order = this.query?.order || "desc";
		const sortOrder = order === "asc" ? 1 : -1; // Determine sort order (default to decending)

		// Validate the sortBy field to ensure it's a valid key
		const validSortFields = [
			"title",
			"rating",
			"budget",
			"visitors",
			"createdAt",
		]; // Add valid fields here
		if (sortBy || order) {
			if (validSortFields.includes(sortBy as string)) {
				// Create a dynamic sort object
				const sortObj = { [sortBy as string]: sortOrder };

				this.queryModel = this.queryModel.sort(sortObj as {});
			}
		}

		return this;
	}

	pagination() {
		const p = Number(this?.query?.page) || 1;
		const l = Number(this?.query?.limit) || 10;

		const skip = (p - 1) * l;

		this.queryModel = this.queryModel.skip(skip).limit(l);

		return this;
	}

	fields() {
		if (this?.query?.fields) {
			const field =
				(this?.query?.fields as string).split(",").join(" ") || "- __v";
			this.queryModel = this.queryModel.select(field);
		}
		return this;
	}

	async countTotal() {
		const queries = this.queryModel.getFilter();

		const totalDocs = await this.queryModel.model.countDocuments(queries);
		const limit = Number(this.query?.limit) || 10;

		const totalPages = Math.ceil(totalDocs / limit);
		const currentPage = Number(this?.query?.page) || 1;
		return {
			totalDocs,
			totalPages,
			currentPage,
		};
	}
}

export default QueryBuilder;
