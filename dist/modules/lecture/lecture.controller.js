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
exports.lectureController = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const lecture_service_1 = require("./lecture.service");
const createIntoDB = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { moduleId } = req.params;
    const result = yield lecture_service_1.lectureServices.createIntoDB(moduleId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        message: "Lecture created successfully",
        result: result,
    });
}));
const getAllFromDB = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield lecture_service_1.lectureServices.getAllFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Lecture fetched successfully",
        meta: result.meta,
        result: result.lectures,
    });
}));
const getById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield lecture_service_1.lectureServices.getById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Lecture fetched successfully",
        result: result,
    });
}));
const updateDoc = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield lecture_service_1.lectureServices.updateDoc(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Lecture updated successfully",
        result: result,
    });
}));
const deleteDoc = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield lecture_service_1.lectureServices.deleteDoc(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Lecture deleted successfully",
        result: result,
    });
}));
const assignedLectureToInstructor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const query = req.query;
    const result = yield lecture_service_1.lectureServices.assignedLectureToInstructor(user.id, query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Assigned Lecture fetched successfully",
        result: result.lectures,
        meta: result.meta,
    });
}));
exports.lectureController = {
    createIntoDB,
    getAllFromDB,
    getById,
    updateDoc,
    deleteDoc,
    assignedLectureToInstructor,
};
