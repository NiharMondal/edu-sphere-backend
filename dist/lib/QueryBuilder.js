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
const constant_1 = require("../constant");
class QueryBuilder {
    constructor(queryModel, query) {
        this.queryModel = queryModel;
        this.query = query;
    }
    filter() {
        const queryCopy = Object.assign({}, this.query);
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
        const mongoQuery = {};
        Object.entries(queryCopy).forEach(([key, value]) => {
            if (typeof value === "string" && value.includes(",")) {
                // For multi-value filters like category=design,development
                mongoQuery[key] = { $in: value.split(",") };
            }
            else {
                mongoQuery[key] = value;
            }
        });
        this.queryModel = this.queryModel.find(mongoQuery);
        return this;
    }
    search(searchableFields) {
        var _a, _b;
        const searchTerm = (_b = (_a = this.query) === null || _a === void 0 ? void 0 : _a.search) === null || _b === void 0 ? void 0 : _b.trim();
        if (searchTerm && searchableFields.length > 0) {
            const regex = new RegExp(searchTerm, "i");
            const orConditions = searchableFields.map((field) => {
                return {
                    [field]: { $regex: regex },
                };
            });
            this.queryModel = this.queryModel.find({ $or: orConditions });
        }
        return this;
    }
    budget() {
        var _a, _b;
        const min = (_a = this.query) === null || _a === void 0 ? void 0 : _a.minBudget;
        const max = (_b = this.query) === null || _b === void 0 ? void 0 : _b.maxBudget;
        if (min || max) {
            this.queryModel = this.queryModel.find({
                budget: Object.assign(Object.assign({}, (min ? { $gte: Number(min) } : {})), (max ? { $lte: Number(max) } : {})),
            });
        }
        return this;
    }
    sort() {
        var _a, _b;
        const sortBy = (_a = this.query) === null || _a === void 0 ? void 0 : _a.sortBy;
        const order = ((_b = this.query) === null || _b === void 0 ? void 0 : _b.order) === "desc" ? -1 : 1;
        if (sortBy) {
            this.queryModel = this.queryModel.sort({ [sortBy]: order });
        }
        else {
            this.queryModel = this.queryModel.sort({ createdAt: order });
        }
        return this;
    }
    pagination() {
        var _a, _b;
        const page = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit) || constant_1.PAGE_LIMIT;
        const skip = (page - 1) * limit;
        this.queryModel = this.queryModel.skip(skip).limit(limit);
        return this;
    }
    fields() {
        var _a;
        if ((_a = this.query) === null || _a === void 0 ? void 0 : _a.fields) {
            const fieldString = this.query.fields.split(",").join(" ") || "-__v";
            this.queryModel = this.queryModel.select(fieldString);
        }
        return this;
    }
    populate(fields) {
        if (fields) {
            const normalized = typeof fields === "string" || !Array.isArray(fields)
                ? [fields]
                : fields;
            this.queryModel = this.queryModel.populate(normalized);
        }
        return this;
    }
    select(keys) {
        this.queryModel = this.queryModel.select(keys);
        return this;
    }
    getQuery() {
        return this.queryModel;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const filters = this.queryModel.getFilter();
            const totalDocs = yield this.queryModel.model.countDocuments(filters);
            const limit = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.limit) || constant_1.PAGE_LIMIT;
            const currentPage = Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.page) || 1;
            const totalPages = Math.ceil(totalDocs / limit);
            return {
                currentPage,
                totalPages,
                totalDocs,
            };
        });
    }
}
exports.default = QueryBuilder;
