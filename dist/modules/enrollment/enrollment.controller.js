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
exports.enrollmentController = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const enrollment_service_1 = require("./enrollment.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createIntoDB = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield enrollment_service_1.enrollmentServices.createIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        message: "Course enrolled successfully",
        result: result,
    });
}));
const getAllFromDB = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield enrollment_service_1.enrollmentServices.getAllFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Enrolled doc fetched successfully",
        result: result,
    });
}));
const myEnrollment = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield enrollment_service_1.enrollmentServices.myEnrollment(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Enrolled doc fetched successfully",
        result: result,
    });
}));
exports.enrollmentController = {
    createIntoDB,
    getAllFromDB,
    myEnrollment,
};
