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
exports.progressServices = void 0;
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const lecture_model_1 = require("../lecture/lecture.model");
const progress_model_1 = require("./progress.model");
const module_model_1 = require("../module/module.model");
const QueryBuilder_1 = __importDefault(require("../../lib/QueryBuilder"));
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const data = new QueryBuilder_1.default(progress_model_1.Progress.find(), query);
    const progress = yield data.queryModel;
    return progress;
});
const getProgressByStudentId = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield progress_model_1.Progress.find({ student: studentId });
    if (!data) {
        throw new CustomError_1.default(404, "Progress data not found");
    }
    return data;
});
const getProgressByStudentIdAndCourseId = (studentId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield progress_model_1.Progress.findOne({
        student: studentId,
        course: courseId,
    });
    if (!data) {
        throw new CustomError_1.default(404, "Progress data not found");
    }
    return data;
});
const markLectureComplete = (courseId, studentId, lectureId) => __awaiter(void 0, void 0, void 0, function* () {
    const lecture = yield lecture_model_1.Lecture.findById(lectureId);
    if (!lecture) {
        throw new CustomError_1.default(404, "Lecture not found!");
    }
    const progress = yield progress_model_1.Progress.findOne({
        course: courseId,
        student: studentId,
    });
    if (!progress) {
        throw new CustomError_1.default(404, "Course or student ID not found!");
    }
    // 1. Get all modules for the course sorted by index
    const modules = yield module_model_1.Module.find({ course: courseId }).populate({
        path: "lectures",
        model: "Lecture",
    });
    let totalLectures = 0;
    if (modules) {
        const lect = modules.flatMap((lec) => lec.lectures);
        totalLectures += lect.length;
    }
    if (totalLectures === 0) {
        throw new CustomError_1.default(400, "Course has no lectures");
    }
    if (!progress.completedLectures.includes(lectureId)) {
        progress.completedLectures.push(lectureId);
    }
    // updating lastWatchedLecture
    progress.lastWatchedLecture = lectureId;
    const completedCount = progress.completedLectures.length; // counting completed lecture length
    progress.progress = Math.round((completedCount / totalLectures) * 100); // calculating percentage %
    yield progress.save();
    return progress;
});
exports.progressServices = {
    getAllFromDB,
    getProgressByStudentId,
    getProgressByStudentIdAndCourseId,
    markLectureComplete,
};
