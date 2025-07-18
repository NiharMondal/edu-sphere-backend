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
exports.notificationController = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const notificcation_service_1 = require("./notificcation.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const getAllFromDB = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notificcation_service_1.notificationServices.getAllFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Notifications fetched successfully",
        result: result,
    });
}));
const getByStudentId = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.id;
    const result = yield notificcation_service_1.notificationServices.getByStudentId(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Notifications fetched successfully by student ID",
        result: result,
    });
}));
const markRead = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nId = req.params.id;
    const sId = req.user.id;
    const result = yield notificcation_service_1.notificationServices.markRead(nId, sId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Notification marked as read",
        result: result,
    });
}));
const markAllRead = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.id;
    const result = yield notificcation_service_1.notificationServices.markAllRead(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Notifications marked as read",
        result: result,
    });
}));
exports.notificationController = {
    getAllFromDB,
    getByStudentId,
    markAllRead,
    markRead,
};
