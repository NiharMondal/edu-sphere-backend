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
exports.userServices = void 0;
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const user_model_1 = require("./user.model");
const QueryBuilder_1 = __importDefault(require("../../lib/QueryBuilder"));
const enrollment_model_1 = require("../enrollment/enrollment.model");
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const res = new QueryBuilder_1.default(user_model_1.User.find({ isDeleted: false }), query)
        .search(["name", "email"])
        .filter()
        .pagination()
        .sort()
        .fields()
        .select("name email role phone createdAt avatar");
    const users = yield res.getQuery();
    const meta = yield res.countTotal();
    return { users, meta };
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    if (!user || (user === null || user === void 0 ? void 0 : user.isDeleted) === true) {
        throw new CustomError_1.default(404, "User not found");
    }
    return user;
});
const updateDoc = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield user_model_1.User.findByIdAndUpdate(id, {
        $set: Object.assign({}, payload),
    }, { new: true, runValidators: true }).select("name email avatar phone");
    if (!res) {
        throw new CustomError_1.default(404, "User not found");
    }
    return res;
});
const updateRole = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new CustomError_1.default(404, "User not found!");
    }
    if (user.role === "instructor" && payload.role === "student") {
        throw new CustomError_1.default(400, "Instructor can not be a student");
    }
    const findEnrollments = yield enrollment_model_1.Enrollment.findOne({ student: id });
    if (findEnrollments) {
        throw new CustomError_1.default(400, "Sorry, This user already enrolled a course!");
    }
    const res = yield user_model_1.User.findByIdAndUpdate(id, Object.assign({}, payload), { new: true, runValidators: true }).select("name email role");
    return res;
});
const getMyProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("name role avatar");
    if (!user) {
        throw new CustomError_1.default(404, "User not found!");
    }
    return user;
});
exports.userServices = {
    getAllFromDB,
    getUserById,
    updateDoc,
    updateRole,
    getMyProfile,
};
