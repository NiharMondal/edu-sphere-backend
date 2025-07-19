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
exports.authController = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const config_1 = require("../../config");
//register user
const registerUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authServices.registerUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        message: "User registered successfully",
        result: result,
    });
}));
//login user
const loginUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authServices.loginUser(req.body);
    const { accessToken, refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "none",
        path: "/",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "User logged in successfully",
        result: { accessToken },
    });
}));
const changePassword = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield auth_service_1.authServices.changePassword(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Password changed successfully",
        result: result,
    });
}));
const getRefreshToken = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const result = yield auth_service_1.authServices.getRefreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "New access token retrieved successfully",
        result: result,
    });
}));
const loggedOut = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        path: "/",
        sameSite: "none",
        secure: config_1.envConfig.node_env === "production",
        httpOnly: false,
    });
    res.clearCookie("refreshToken", {
        path: "/",
        sameSite: "none",
        secure: true,
        httpOnly: true,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Logged out successfully",
        result: {
            message: "Ok",
        },
    });
}));
exports.authController = {
    registerUser,
    loginUser,
    changePassword,
    getRefreshToken,
    loggedOut,
};
