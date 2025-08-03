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
exports.reviewController = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const review_service_1 = require("./review.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createIntoDB = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield review_service_1.reviewServices.createIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        message: "Review created successfully",
        result: data,
    });
}));
const getAllFromDB = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield review_service_1.reviewServices.getAllFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Reviews fetched successfully",
        result: data.reviews,
        meta: data === null || data === void 0 ? void 0 : data.meta,
    });
}));
const getById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = yield review_service_1.reviewServices.getById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Review fetched successfully",
        result: data,
    });
}));
const getByCourseId = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    const data = yield review_service_1.reviewServices.getByCourseId(courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Reviews fetched successfully",
        result: data,
    });
}));
const updateDoc = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield review_service_1.reviewServices.updateDoc(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Reviews updated successfully",
        result: data,
    });
}));
const deleteDoc = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield review_service_1.reviewServices.deleteDoc(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Review deleted successfully",
        result: data,
    });
}));
const acceptReview = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield review_service_1.reviewServices.acceptReview(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Review accepted successfully",
        result: data,
    });
}));
const undoAccept = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield review_service_1.reviewServices.undoAccept(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Removed form accepted review",
        result: data,
    });
}));
exports.reviewController = {
    createIntoDB,
    getAllFromDB,
    getById,
    getByCourseId,
    acceptReview,
    deleteDoc,
    updateDoc,
    undoAccept,
};
