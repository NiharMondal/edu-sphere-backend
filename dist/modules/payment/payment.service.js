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
exports.paymentServices = void 0;
const stripe_1 = __importDefault(require("stripe"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const enrollment_model_1 = require("../enrollment/enrollment.model");
const payment_model_1 = require("./payment.model");
const config_1 = require("../../config");
const QueryBuilder_1 = __importDefault(require("../../lib/QueryBuilder"));
const module_model_1 = require("../module/module.model");
const course_model_1 = require("../course/course.model");
const mongoose_1 = __importDefault(require("mongoose"));
const progress_model_1 = require("../progress/progress.model");
const socket_1 = require("../../socket");
const notification_model_1 = require("../notification/notification.model");
const stripe = new stripe_1.default(config_1.envConfig.stripe_secret_key);
const webhookSecret = config_1.envConfig.stripe_web_secret;
const createIntoDB = (body, sig) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    let event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    }
    catch (err) {
        throw new CustomError_1.default(400, `Webhook Error: ${err}.message`);
    }
    // Handle successful payment
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const studentId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.student;
        const courseId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.course;
        const pricingType = (_c = session.metadata) === null || _c === void 0 ? void 0 : _c.pricingType;
        const dbSession = yield mongoose_1.default.startSession();
        dbSession.startTransaction();
        try {
            // Find course and student
            const course = yield course_model_1.Course.findById(courseId).populate({
                path: "modules",
                select: "_id slug",
                populate: {
                    path: "lectures",
                    select: "_id slug",
                },
            });
            if (!course)
                throw new Error("Course not found");
            // Get first lecture
            const modules = yield module_model_1.Module.find({ course: courseId })
                .sort({ index: 1 })
                .populate({ path: "lectures", match: { isDeleted: false } });
            let firstLecture = null;
            for (const module of modules) {
                if (module.lectures.length > 0) {
                    firstLecture = module.lectures[0]._id;
                    break;
                }
            }
            // Create progress
            const progress = yield progress_model_1.Progress.create([
                {
                    course: courseId,
                    student: studentId,
                    lastWatchedLecture: firstLecture,
                },
            ], { session: dbSession });
            // Create enrollment
            const enrollment = yield enrollment_model_1.Enrollment.create([
                {
                    course: courseId,
                    student: studentId,
                    progress: progress[0]._id,
                    pricingType,
                    status: "paid",
                },
            ], { session: dbSession });
            // Create notification
            const notification = yield notification_model_1.Notification.create([
                {
                    user: studentId,
                    type: "enrollment",
                    message: `Welcome to ${course === null || course === void 0 ? void 0 : course.title}`,
                },
            ], { session: dbSession });
            // Real-time emit
            const io = (0, socket_1.getIO)();
            const socketId = (0, socket_1.getUserSocketMap)().get(studentId);
            if (socketId) {
                io.to(socketId).emit("new-notification", notification[0]);
            }
            // Save payment history
            yield payment_model_1.PaymentHistory.create([
                {
                    student: studentId,
                    course: courseId,
                    checkoutSessionId: session.id,
                    amount: session.amount_total / 100,
                    currency: session.currency,
                    paymentStatus: session.payment_status,
                    paymentIntentId: session.payment_intent,
                    customerDetails: {
                        email: (_d = session.customer_details) === null || _d === void 0 ? void 0 : _d.email,
                        name: (_e = session.customer_details) === null || _e === void 0 ? void 0 : _e.name,
                        address: (_f = session.customer_details) === null || _f === void 0 ? void 0 : _f.address,
                    },
                },
            ], { session: dbSession });
            yield dbSession.commitTransaction();
        }
        catch (err) {
            console.error("Webhook failed:", err);
            yield dbSession.abortTransaction();
        }
        finally {
            dbSession.endSession();
        }
    }
});
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(payment_model_1.PaymentHistory.find(), query)
        .search(["paymentIntentId"])
        .filter()
        .pagination()
        .sort()
        .fields()
        .populate([
        { path: "student", select: "name" },
        { path: "course", select: "title" },
    ]);
    const paymentHistory = yield queryBuilder.getQuery();
    const meta = yield queryBuilder.countTotal();
    return { meta, paymentHistory };
});
exports.paymentServices = { createIntoDB, getAllFromDB };
