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
exports.moduleController = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const module_service_1 = require("./module.service");
const createIntoDB = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const result = yield module_service_1.moduleServices.createIntoDB(courseId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        message: "Module created successfully",
        result: result,
    });
}));
const getAllFromDB = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield module_service_1.moduleServices.getAllFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Module fetched successfully",
        result: result.modules,
        meta: result.meta,
    });
}));
const getById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield module_service_1.moduleServices.getById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Module fetched successfully",
        result: result,
    });
}));
const getByCourseId = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield module_service_1.moduleServices.getByCourseId(req.params.courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Module fetched successfully by course ID",
        result: result,
    });
}));
const updateDoc = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield module_service_1.moduleServices.updateDoc(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Module updated successfully",
        result: result,
    });
}));
const deleteDoc = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield module_service_1.moduleServices.deleteDoc(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Module deleted successfully",
        result: result,
    });
}));
const assignedModuleToInstructor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield module_service_1.moduleServices.assignedModuleToInstructor(user.id, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Module fetched by instructor successfully",
        result: result.modules,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
}));
exports.moduleController = {
    createIntoDB,
    getAllFromDB,
    getById,
    getByCourseId,
    updateDoc,
    deleteDoc,
    assignedModuleToInstructor,
};
