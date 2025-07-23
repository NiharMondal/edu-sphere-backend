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
exports.enrollmentServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const course_model_1 = require("../course/course.model");
const enrollment_model_1 = require("./enrollment.model");
const user_model_1 = require("../user/user.model");
const QueryBuilder_1 = __importDefault(require("../../lib/QueryBuilder"));
const module_model_1 = require("../module/module.model");
const progress_model_1 = require("../progress/progress.model");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../../config");
const notification_model_1 = require("../notification/notification.model");
const socket_1 = require("../../socket");
const stripe = new stripe_1.default(config_1.envConfig.stripe_secret_key);
const createIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //find student by id
    const student = yield user_model_1.User.findById(payload.student);
    if (!student) {
        throw new CustomError_1.default(404, "Student not found!");
    }
    //find course
    const course = yield course_model_1.Course.findById(payload.course).populate({
        path: "modules",
        select: "_id slug",
        populate: {
            path: "lectures",
            select: "_id slug",
            model: "Lecture",
        },
    });
    if (!course) {
        throw new CustomError_1.default(404, "Course not found!");
    }
    //checking existing enrollment
    const existedEnrollment = yield enrollment_model_1.Enrollment.findOne({
        course: payload.course,
        student: payload.student,
    });
    if (existedEnrollment) {
        throw new CustomError_1.default(400, "You have already enrolled this course");
    }
    // 1. Get all modules for the course sorted by index
    const modules = yield module_model_1.Module.find({ course: payload.course })
        .sort({ index: 1 }) // assuming your "index" field determines order
        .populate({
        path: "lectures",
        model: "Lecture",
        match: { isDeleted: false },
    });
    // 2. Find the first lecture across all modules
    let firstLecture = null;
    for (const module of modules) {
        if (module.lectures.length > 0) {
            firstLecture = module.lectures[0]._id;
            break;
        }
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    if (course.pricingType === "free") {
        try {
            const progressData = new progress_model_1.Progress(Object.assign(Object.assign({}, payload), { lastWatchedLecture: firstLecture }));
            yield progressData.save({ session }); // 1st step: creating progress for the requested course
            //creating enrollment
            const enrollmentData = new enrollment_model_1.Enrollment({
                course: payload.course,
                student: payload.student,
                progress: progressData._id,
                pricingType: course === null || course === void 0 ? void 0 : course.pricingType,
            });
            //creating notification
            const notification = new notification_model_1.Notification({
                user: payload.student,
                type: "enrollment",
                message: `Welcome to ${course === null || course === void 0 ? void 0 : course.title}`,
            });
            yield notification.save({ session }); // 2nd step: creating notification
            const io = (0, socket_1.getIO)();
            const socketId = (0, socket_1.getUserSocketMap)().get(payload.student);
            if (socketId) {
                io.to(socketId).emit("new-notification", notification);
            }
            yield enrollmentData.save({ session }); //3rd step: at last creating enrollment data
            //committing transaction
            yield session.commitTransaction();
            session.endSession();
            return enrollmentData;
        }
        catch (error) {
            console.log(error);
            yield session.abortTransaction();
            session.endSession();
            throw new CustomError_1.default(400, "Could not enrolled course");
        }
    }
    else {
        try {
            const progressData = new progress_model_1.Progress(Object.assign(Object.assign({}, payload), { lastWatchedLecture: firstLecture }));
            yield progressData.save({ session }); // 1st step: creating progress for the requested course
            const enrollment = new enrollment_model_1.Enrollment({
                course: payload.course,
                student: payload.student,
                progress: progressData._id,
                pricingType: course === null || course === void 0 ? void 0 : course.pricingType,
            });
            //creating notification
            const notification = new notification_model_1.Notification({
                user: payload.student,
                type: "enrollment",
                message: `Welcome to ${course === null || course === void 0 ? void 0 : course.title}`,
            });
            yield notification.save({ session }); // 2nd step: creating notification
            const io = (0, socket_1.getIO)();
            const socketId = (0, socket_1.getUserSocketMap)().get(payload.student);
            if (socketId) {
                io.to(socketId).emit("new-notification", notification);
            }
            const stripeSession = yield stripe.checkout.sessions.create({
                payment_method_types: [
                    "card",
                    "acss_debit",
                    "paypal",
                    "amazon_pay",
                ],
                mode: "payment",
                line_items: [
                    {
                        price_data: {
                            currency: "bdt",
                            product_data: { name: course.title },
                            unit_amount: Math.round(payload.amount * 100),
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${config_1.envConfig.front_end_url}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${config_1.envConfig.front_end_url}/cancel`,
                metadata: {
                    student: payload.student.toString(),
                    course: payload.course.toString(),
                    enrollmentId: enrollment._id.toString(),
                },
            });
            yield enrollment.save({ session }); // 3rd step: saving enrollment data
            yield session.commitTransaction();
            yield session.endSession();
            return { url: stripeSession.url };
        }
        catch (error) {
            console.log(error);
            yield session.abortTransaction();
            yield session.endSession();
            throw new CustomError_1.default(400, "Could not enrolled course");
        }
    }
});
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(query);
    const res = new QueryBuilder_1.default(enrollment_model_1.Enrollment.find(), query);
    const data = yield res.queryModel;
    return data;
});
const myEnrollment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield enrollment_model_1.Enrollment.find({ student: id })
        .populate({
        path: "course",
        select: "title thumbnail instructor",
        populate: {
            path: "instructor",
            select: "name",
        },
    })
        .populate({
        path: "progress",
        select: "progress",
        populate: {
            path: "lastWatchedLecture",
            select: "type",
        },
    })
        .sort({ createdAt: -1 });
    return res;
});
exports.enrollmentServices = { createIntoDB, getAllFromDB, myEnrollment };
