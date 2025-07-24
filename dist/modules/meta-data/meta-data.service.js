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
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaDataServices = void 0;
const course_model_1 = require("../course/course.model");
const payment_model_1 = require("../payment/payment.model");
const user_model_1 = require("../user/user.model");
const generalInformation = () => __awaiter(void 0, void 0, void 0, function* () {
    const studentCount = yield user_model_1.User.countDocuments({ role: "student" });
    const instructorCount = yield user_model_1.User.countDocuments({ role: "instructor" });
    const courseCount = yield course_model_1.Course.countDocuments();
    const totalEarning = yield payment_model_1.PaymentHistory.find();
    const subTotal = totalEarning.reduce((acc, curr) => curr.amount + acc, 0);
    return {
        students: studentCount,
        instructors: instructorCount,
        courses: courseCount,
        earnings: subTotal,
    };
});
const revenue = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield payment_model_1.PaymentHistory.find().select("createdAt amount");
    return res;
});
exports.metaDataServices = { generalInformation, revenue };
