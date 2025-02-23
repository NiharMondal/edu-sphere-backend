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
    const user = yield user_model_1.User.findOne({ email: payload.email });
    if (!user) {
        throw new CustomError_1.default(404, "Invalid credentials");
    }
    const validPassword = yield (0, checkPassword_1.checkPassword)(payload.password, user.password);
    if (!validPassword) {
        throw new CustomError_1.default(404, "Invalid credentials");
    }
    const tokenPayload = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    };
    const token = (0, utils_1.generateToken)(tokenPayload);
    return {
        accessToken: token,
    };
});
exports.authServices = {
    registerUser,
    loginUser,
};
