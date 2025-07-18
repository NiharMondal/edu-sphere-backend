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
exports.authServices = void 0;
const checkPassword_1 = require("../../utils/checkPassword");
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const user_model_1 = require("../user/user.model");
const utils_1 = require("../../utils");
const config_1 = require("../../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email });
    if (user) {
        throw new CustomError_1.default(302, "Email already exist");
    }
    //create doc
    const res = yield user_model_1.User.create(payload);
    return {
        id: res._id,
        name: res.name,
        email: res.email,
    };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //check user
    const user = yield user_model_1.User.findOne({ email: payload.email, isDeleted: false });
    if (!user) {
        throw new CustomError_1.default(404, "Invalid credentials");
    }
    const validPassword = yield (0, checkPassword_1.comparePassword)(payload.password, user.password);
    if (!validPassword) {
        throw new CustomError_1.default(400, "Invalid credentials");
    }
    const tokenPayload = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    };
    const accessToken = (0, utils_1.generateToken)(tokenPayload, config_1.envConfig.access_token_secret, config_1.envConfig.access_token_expire);
    const refreshToken = (0, utils_1.generateToken)(tokenPayload, config_1.envConfig.refresh_token_secret, config_1.envConfig.refresh_token_expire);
    return {
        accessToken,
        refreshToken,
    };
});
const changePassword = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new CustomError_1.default(404, "User not found");
    }
    if (payload.newPassword !== payload.confirmPassword) {
        throw new CustomError_1.default(400, "Password does not match");
    }
    const matchPassword = yield (0, checkPassword_1.comparePassword)(payload.oldPassword, user.password);
    if (!matchPassword) {
        throw new CustomError_1.default(400, "Invalid credentials");
    }
    const isSame = yield (0, checkPassword_1.comparePassword)(payload.newPassword, user.password);
    if (isSame) {
        throw new CustomError_1.default(400, "New password must be different from current password");
    }
    const hashed = yield (0, checkPassword_1.hashPassword)(payload.newPassword);
    yield user_model_1.User.findByIdAndUpdate(id, {
        $set: {
            password: hashed,
        },
    }, { new: true, runValidators: true });
});
const getRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new CustomError_1.default(401, "You are un authorized");
    }
    const verifyData = jsonwebtoken_1.default.verify(token, config_1.envConfig.refresh_token_secret);
    const user = yield user_model_1.User.findById(verifyData.id);
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (!user) {
        throw new CustomError_1.default(404, "No user found");
    }
    if (isDeleted) {
        throw new CustomError_1.default(400, "Sorry, user is deleted");
    }
    const tokenPayload = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    };
    const accessToken = (0, utils_1.generateToken)(tokenPayload, config_1.envConfig.access_token_secret, config_1.envConfig.access_token_expire);
    return { accessToken };
});
exports.authServices = {
    registerUser,
    loginUser,
    changePassword,
    getRefreshToken,
};
