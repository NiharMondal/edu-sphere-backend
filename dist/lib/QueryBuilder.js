"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(queryModel, query) {
        this.queryModel = queryModel;
        this.query = query;
    }
    filter() {
        const queryCopy = Object.assign({}, this.query);
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
    search(searchableFields) {
        var _a;
        if ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.search) {
            this.queryModel = this.queryModel.find({
                $or: searchableFields.map((field) => {
                    var _a;
                    return ({
                        [field]: {
                            $regex: (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.search,
                            $options: "i",
                        },
                    });
                }),
            });
        }
        return this;
    }
    budget() {
        var _a, _b;
        const minPrice = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.minBudget) || 0;
        const maxPrice = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.maxBudget) || 12000;
        if (minPrice || maxPrice) {
            this.queryModel = this.queryModel.find({
                budget: { $gte: minPrice, $lte: maxPrice },
            });
        }
        return this;
    }
    sort() {
        var _a, _b;
        const sortBy = ((_a = this.query) === null || _a === void 0 ? void 0 : _a.sortBy) || "createdAt";
        const order = ((_b = this.query) === null || _b === void 0 ? void 0 : _b.order) || "desc";
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
            if (validSortFields.includes(sortBy)) {
                // Create a dynamic sort object
                const sortObj = { [sortBy]: sortOrder };
                this.queryModel = this.queryModel.sort(sortObj);
            }
        }
        return this;
    }
    pagination() {
        var _a, _b;
        const p = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const l = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        const skip = (p - 1) * l;
        this.queryModel = this.queryModel.skip(skip).limit(l);
        return this;
    }
    fields() {
        var _a, _b;
        if ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) {
            const field = ((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.fields).split(",").join(" ") || "- __v";
            this.queryModel = this.queryModel.select(field);
        }
        return this;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const queries = this.queryModel.getFilter();
            const totalDocs = yield this.queryModel.model.countDocuments(queries);
            const limit = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.limit) || 10;
            const totalPages = Math.ceil(totalDocs / limit);
            const currentPage = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.page) || 1;
            return {
                totalDocs,
                totalPages,
                currentPage,
            };
        });
    }
}
exports.default = QueryBuilder;
