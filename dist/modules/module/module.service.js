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
exports.moduleServices = void 0;
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const course_model_1 = require("../course/course.model");
const lecture_model_1 = require("../lecture/lecture.model");
const module_model_1 = require("./module.model");
const createIntoDB = (courseId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // double checking by courseId and params
    const course = yield course_model_1.Course.findOne({
        $and: [{ _id: courseId }, { _id: payload.course }],
    });
    if (!course) {
        throw new CustomError_1.default(404, "Requested course is not found!");
    }
    // checking module exist or not
    const existedModule = yield module_model_1.Module.findOne({ title: payload.title });
    if (existedModule) {
        throw new CustomError_1.default(302, "Module title is already exist!");
    }
    //actual data
    const data = yield module_model_1.Module.create(payload);
    //updating course collection
    yield course_model_1.Course.findOneAndUpdate({ _id: courseId }, {
        $push: {
            modules: data._id,
        },
    });
    return data;
});
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = query;
    const modules = yield module_model_1.Module.find()
        .populate({
        path: "course",
        select: "title",
    })
        .populate({
        path: "lectures",
    })
        .sort({ createdat: "desc" });
    return modules;
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield module_model_1.Module.findById(id).populate({ path: "lectures" });
    if (!data) {
        throw new CustomError_1.default(404, "Module not found!");
    }
    return data;
});
const updateDoc = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const module = yield module_model_1.Module.findById(id);
    if (!module) {
        throw new CustomError_1.default(404, "Module not found!");
    }
    const data = yield module_model_1.Module.findByIdAndUpdate({ _id: id }, {
        $set: Object.assign({}, payload),
    }, { new: true, runValidators: true });
    return data;
});
const deleteDoc = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield module_model_1.Module.findById(id);
    if (!res) {
        throw new CustomError_1.default(404, "Module not found!");
    }
    //delete lectures based on module id
    yield lecture_model_1.Lecture.deleteMany({ module: id }); // id refers to module id
    //updating course module array
    yield course_model_1.Course.findByIdAndUpdate(res.course, { $pull: { modules: id } });
    //deleting module
    const data = yield module_model_1.Module.findByIdAndDelete(id);
    return data;
});
exports.moduleServices = {
    createIntoDB,
    getAllFromDB,
    getById,
    updateDoc,
    deleteDoc,
};
