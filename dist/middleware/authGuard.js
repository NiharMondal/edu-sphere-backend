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
exports.authGuard = void 0;
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const user_model_1 = require("../modules/user/user.model");
const authGuard = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        try {
            if (!token) {
                throw new CustomError_1.default(401, "Access token missing");
            }
            const decodeToken = jsonwebtoken_1.default.verify(token, config_1.envConfig.access_token_secret);
            const { id, role, exp } = decodeToken;
            // Correct expiration check (exp is in seconds)
            if (exp && exp < Math.floor(Date.now() / 1000)) {
                throw new CustomError_1.default(401, "Access token expired");
            }
            const user = yield user_model_1.User.findById(id);
            if (!user || user.isDeleted) {
                throw new CustomError_1.default(401, "User not found or deleted");
            }
            // Check for required role (authorization)
            if (roles.length && !roles.includes(role)) {
                throw new CustomError_1.default(403, "Forbidden: insufficient permissions");
            }
            // Attach user info to request object
            req.user = decodeToken;
            next();
        }
        catch (error) {
            // Optional: Handle token expiration separately if you want
            if (error instanceof Error &&
                error.name === "TokenExpiredError") {
                next(new CustomError_1.default(401, "Access token expired"));
            }
            else {
                next(error);
            }
        }
    });
};
exports.authGuard = authGuard;
