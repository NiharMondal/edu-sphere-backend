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
const mongoose_1 = __importDefault(require("mongoose"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const module_model_1 = require("../module/module.model");
const lecture_model_1 = require("./lecture.model");
const course_model_1 = require("../course/course.model");
const QueryBuilder_1 = __importDefault(require("../../lib/QueryBuilder"));
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
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const newLecture = new lecture_model_1.Lecture(payload);
        yield newLecture.save({ session }); // first transaction -> create lecture
        //second tran -> update module collection
        const updateModule = yield module_model_1.Module.findOneAndUpdate({ _id: moduleId }, {
            $push: {
                lectures: newLecture._id,
            },
        }, { new: true }).session(session);
        if (!updateModule) {
            yield session.abortTransaction();
            session.endSession();
            throw new CustomError_1.default(400, "Failed to update module with new lecture");
        }
        //commit session
        yield session.commitTransaction();
        session.endSession();
        return newLecture;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.log(error);
        throw new CustomError_1.default(500, "Could not create lecture");
    }
});
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(lecture_model_1.Lecture.find(), query)
        .search(["title"])
        .sort()
        .pagination()
        .fields()
        .populate({
        path: "module",
        select: "title course",
        populate: {
            path: "course",
            select: "title",
        },
    });
    const lectures = yield queryBuilder.getQuery();
    const meta = yield queryBuilder.countTotal();
    return {
        meta,
        lectures,
    };
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
const assignedLectureToInstructor = (insId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield course_model_1.Course.find({ instructor: insId });
    const courseIds = courses.map((c) => c._id);
    const modules = yield module_model_1.Module.find({ course: { $in: courseIds } });
    const modulesId = modules.map((m) => m === null || m === void 0 ? void 0 : m._id);
    const queryBuilder = new QueryBuilder_1.default(lecture_model_1.Lecture.find({ module: { $in: modulesId } }), query)
        .search(["title"])
        .sort()
        .pagination()
        .populate({
        path: "module",
        select: "title course",
        populate: {
            path: "course",
            select: "title",
        },
    });
    const lectures = yield queryBuilder.getQuery();
    const meta = yield queryBuilder.countTotal();
    return { lectures, meta };
});
exports.lectureServices = {
    createIntoDB,
    getAllFromDB,
    getById,
    updateDoc,
    deleteDoc,
    assignedLectureToInstructor,
};
