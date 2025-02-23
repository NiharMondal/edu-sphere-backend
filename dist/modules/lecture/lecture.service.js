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
exports.lectureServices = void 0;
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const module_model_1 = require("../module/module.model");
const lecture_model_1 = require("./lecture.model");
const createIntoDB = (moduleId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // double checking by moduleId and params
    const module = yield module_model_1.Module.findOne({
        $and: [{ _id: moduleId }, { _id: payload.module }],
    });
    if (!module) {
        throw new CustomError_1.default(404, "Requested module is not found!");
    }
    // checking Lecture exist or not
    const existedLecture = yield lecture_model_1.Lecture.findOne({ title: payload.title });
    if (existedLecture) {
        throw new CustomError_1.default(302, "Lecture title is already exist!");
    }
    //actual data
    const data = yield lecture_model_1.Lecture.create(payload);
    //updating course collection
    yield module_model_1.Module.findOneAndUpdate({ _id: moduleId }, {
        $push: {
            lectures: data._id,
        },
    });
    return data;
});
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = query;
    const data = yield lecture_model_1.Lecture.find().populate("module", "title");
    return data;
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield lecture_model_1.Lecture.findById(id);
    if (!data) {
        throw new CustomError_1.default(404, "Lecture not found!");
    }
    return data;
});
const updateDoc = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield lecture_model_1.Lecture.findById(id);
    if (!res) {
        throw new CustomError_1.default(404, "Lecture not found!");
    }
    const data = yield lecture_model_1.Lecture.findByIdAndUpdate({ _id: id }, {
        $set: Object.assign({}, payload),
    }, { new: true, runValidators: true });
    return data;
});
const deleteDoc = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const lecture = yield lecture_model_1.Lecture.findById(id);
    if (!lecture) {
        throw new CustomError_1.default(404, "Lecture not found!");
    }
    //updating lectures field from module collection
    yield module_model_1.Module.findByIdAndUpdate(lecture.module, { $pull: { lectures: id } });
    const data = yield lecture_model_1.Lecture.findByIdAndDelete(id);
    return data;
});
exports.lectureServices = {
    createIntoDB,
    getAllFromDB,
    getById,
    updateDoc,
    deleteDoc,
};
