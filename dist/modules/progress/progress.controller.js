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
exports.progressController = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const progress_service_1 = require("./progress.service");
const getAllFromDB = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield progress_service_1.progressServices.getAllFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Progress fetched successfully",
        result: result,
    });
}));
const getProgressByStudentId = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield progress_service_1.progressServices.getProgressByStudentId(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Progress fetched successfully",
        result: result,
    });
}));
const getProgressByStudentIdAndCourseId = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { courseId } = req.params;
    const result = yield progress_service_1.progressServices.getProgressByStudentIdAndCourseId(id, courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Course progress fetched successfully",
        result: result,
    });
}));
const markLectureComplete = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lectureId = req.params.lectureId;
    const { student, course } = req.body;
    const result = yield progress_service_1.progressServices.markLectureComplete(course, student, lectureId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        message: "Lecture updated successfully",
        result: result,
    });
}));
exports.progressController = {
    getAllFromDB,
    getProgressByStudentId,
    getProgressByStudentIdAndCourseId,
    markLectureComplete,
};
