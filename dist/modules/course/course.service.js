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
exports.courseServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../lib/QueryBuilder"));
const utils_1 = require("../../utils");
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const lecture_model_1 = require("../lecture/lecture.model");
const module_model_1 = require("../module/module.model");
const course_model_1 = require("./course.model");
const createIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existedCourse = yield course_model_1.Course.findOne({ slug: payload.slug });
    if (existedCourse) {
        throw new CustomError_1.default(302, "Course title is already exist!");
    }
    const slug = (0, utils_1.generateSlug)(payload === null || payload === void 0 ? void 0 : payload.title);
    const data = yield course_model_1.Course.create(Object.assign(Object.assign({}, payload), { slug: slug }));
    return data;
});
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const res = new QueryBuilder_1.default(course_model_1.Course.find(), query).search(["title"]);
    const courses = yield res.queryModel.populate({
        path: "modules",
        populate: {
            path: "lectures",
        },
    });
    return courses;
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield course_model_1.Course.findById(id).populate({ path: "modules" });
    if (!data) {
        throw new CustomError_1.default(404, "Course not found!");
    }
    return data;
});
const getBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield course_model_1.Course.findOne({ slug }).populate({
        path: "modules",
        select: "title",
    });
    if (!data) {
        throw new CustomError_1.default(404, "Course not found!");
    }
    return data;
});
const updateDoc = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield course_model_1.Course.findById(id);
    if (!res) {
        throw new CustomError_1.default(404, "Course not found!");
    }
    const slug = (0, utils_1.generateSlug)(payload === null || payload === void 0 ? void 0 : payload.title);
    const data = yield course_model_1.Course.findByIdAndUpdate({ _id: id }, {
        $set: Object.assign(Object.assign({}, payload), { slug: slug }),
    }, { new: true, runValidators: true });
    return data;
});
const deleteDoc = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.Course.findById(id);
    if (!course) {
        throw new CustomError_1.default(404, "Course not found!");
    }
    const module = yield module_model_1.Module.find({ course: id });
    module.forEach((val) => __awaiter(void 0, void 0, void 0, function* () { return yield lecture_model_1.Lecture.deleteMany({ module: val._id }); }));
    yield lecture_model_1.Lecture.deleteMany({ module: module });
    yield module_model_1.Module.deleteMany({ course: id });
    const data = yield course_model_1.Course.findByIdAndDelete(id);
    return data;
});
exports.courseServices = {
    createIntoDB,
    getAllFromDB,
    getById,
    getBySlug,
    updateDoc,
    deleteDoc,
};
