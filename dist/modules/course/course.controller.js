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
exports.courseController = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const course_service_1 = require("./course.service");
const createIntoDB = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.courseServices.createIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        message: "Course created successfully",
        result: result,
    });
}));
const getAllFromDB = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.courseServices.getAllFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Course fetched successfully",
        result: result.courses,
        meta: result.meta,
    });
}));
const getById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.courseServices.getById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Course fetched successfully",
        result: result,
    });
}));
const getBySlug = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.courseServices.getBySlug(req.params.slug);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Course fetched successfully",
        result: result,
    });
}));
const updateDoc = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield course_service_1.courseServices.updateDoc(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Course updated successfully",
        result: result,
    });
}));
const deleteDoc = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.courseServices.deleteDoc(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Course deleted successfully",
        result: result,
    });
}));
const popularCourses = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.courseServices.popularCourses();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Popular courses fetched successfully",
        result: result,
    });
}));
const getCoursesByInstructorId = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield course_service_1.courseServices.getCoursesByInstructorId(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "My courses fetched successfully",
        result: result,
    });
}));
exports.courseController = {
    createIntoDB,
    getAllFromDB,
    getById,
    getBySlug,
    updateDoc,
    deleteDoc,
    popularCourses,
    getCoursesByInstructorId,
};
