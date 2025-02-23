"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const slugify_1 = __importDefault(require("slugify"));
const generateToken = (payload) => {
    // const token = jwt.sign(payload, envConfig.jwt_secret!, {
    // 	expiresIn,
    // });
    const token = jsonwebtoken_1.default.sign(payload, config_1.envConfig.jwt_secret, {
        expiresIn: "2d",
    });
    return token;
};
exports.generateToken = generateToken;
const generateSlug = (payload) => {
    const slug = (0, slugify_1.default)(payload, {
        lower: true,
        trim: true,
    });
    return slug;
};
exports.generateSlug = generateSlug;
