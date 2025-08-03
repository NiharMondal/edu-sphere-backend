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
exports.reviewServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const course_model_1 = require("../course/course.model");
const review_model_1 = require("./review.model");
const QueryBuilder_1 = __importDefault(require("../../lib/QueryBuilder"));
const createIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //find student
    const student = yield user_model_1.User.findById(payload.student);
    if (!student) {
        throw new CustomError_1.default(404, "User not found!");
    }
    //find course
    const course = yield course_model_1.Course.findById(payload.course);
    if (!course) {
        throw new CustomError_1.default(404, "Course not found!");
    }
    // checking user gave a review
    const existedReview = yield review_model_1.Review.findOne({
        user: payload.student,
        course: payload.course,
    });
    if (existedReview) {
        throw new CustomError_1.default(400, "You already gave a review to this course!");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // create Review
        const review = new review_model_1.Review(payload);
        yield review.save({ session });
        // find all given Review to this course;
        const countReview = yield review_model_1.Review.find({
            course: payload.course,
        }).session(session);
        const totalRating = countReview.reduce((acc, curr) => acc + curr.rating, 0);
        //calculating avg rating
        const avgRating = Math.round(totalRating / countReview.length);
        // updating course rating field
        yield course_model_1.Course.findByIdAndUpdate(payload.course, {
            $set: {
                rating: avgRating,
            },
        }, { new: true, runValidators: true });
        yield session.commitTransaction();
        yield session.endSession();
        return review;
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        yield session.endSession();
    }
});
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const res = new QueryBuilder_1.default(review_model_1.Review.find({ isDeleted: false }), query)
        .search(["message"])
        .filter()
        .pagination()
        .sort()
        .populate([
        { path: "student", select: "name" },
        { path: "course", select: "title" },
    ]);
    const reviews = yield res.getQuery();
    const meta = yield res.countTotal();
    return { reviews, meta };
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield review_model_1.Review.findById(id);
    if (!data) {
        throw new CustomError_1.default(404, "Review not found");
    }
    return data;
});
const getByCourseId = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.find({ course: courseId }).populate({
        path: "student",
        select: "name",
    });
    if (!review) {
        throw new CustomError_1.default(404, "Review not found");
    }
    return review;
});
const updateDoc = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById({
        _id: id,
    });
    if (!review) {
        throw new CustomError_1.default(404, "Review not found");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const updatedReview = yield review_model_1.Review.findOneAndUpdate({ _id: id, student: review.student, course: review.course }, {
            $set: {
                rating: payload.rating,
                message: payload.message,
            },
        }, { new: true }).session(session); // 1st:  step to update review collection
        // find all given Review to this course;
        const countReview = yield review_model_1.Review.find({
            course: review.course,
        }).session(session); //2nd : find all reviews under the course ID
        const totalRating = countReview.reduce((acc, curr) => acc + curr.rating, 0);
        //calculating avg rating
        const avgRating = Math.round(totalRating / countReview.length);
        // updating course rating field
        yield course_model_1.Course.findByIdAndUpdate({ _id: review.course }, {
            $set: {
                rating: avgRating,
            },
        }, { new: true }).session(session); // 3rd: updating course rating field
        yield session.commitTransaction();
        yield session.endSession();
        return updatedReview;
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        yield session.endSession();
    }
});
const deleteDoc = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(id);
    if (!review) {
        throw new CustomError_1.default(404, "Review not found!");
    }
    const updatedReview = yield review_model_1.Review.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return updatedReview;
});
const acceptReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedData = yield review_model_1.Review.findByIdAndUpdate({ _id: id }, { isAccepted: true }, { new: true });
    return updatedData;
});
const undoAccept = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedData = yield review_model_1.Review.findByIdAndUpdate({ _id: id }, { isAccepted: false }, { new: true });
    return updatedData;
});
exports.reviewServices = {
    createIntoDB,
    getAllFromDB,
    getById,
    getByCourseId,
    updateDoc,
    deleteDoc,
    acceptReview,
    undoAccept,
};
