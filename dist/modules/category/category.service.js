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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryServices = void 0;
const utils_1 = require("../../utils");
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const category_model_1 = require("./category.model");
const createIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, utils_1.generateSlug)(payload.name);
    const data = yield category_model_1.Category.create(Object.assign(Object.assign({}, payload), { slug }));
    return data;
});
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield category_model_1.Category.aggregate([
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
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield category_model_1.Category.findById(id);
    return data;
});
const getBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield category_model_1.Category.findOne({ slug: slug });
    return data;
});
const updateDoc = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.findById(id);
    if (!category) {
        throw new CustomError_1.default(404, "Data not found");
    }
    const slug = (0, utils_1.generateSlug)(payload.name || category.name);
    const updatedCategory = yield category_model_1.Category.findByIdAndUpdate(id, {
        $set: Object.assign(Object.assign({}, payload), { slug: slug }),
    }, { new: true, runValidators: true });
    return updatedCategory;
});
const deleteDoc = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.findById(id);
    if (!category) {
        throw new CustomError_1.default(404, "Data not found");
    }
    const data = yield category_model_1.Category.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
    return data;
});
exports.categoryServices = {
    createIntoDB,
    getAllFromDB,
    getById,
    getBySlug,
    updateDoc,
    deleteDoc,
};
