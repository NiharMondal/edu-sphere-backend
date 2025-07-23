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
exports.courseServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../lib/QueryBuilder"));
const utils_1 = require("../../utils");
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const lecture_model_1 = require("../lecture/lecture.model");
const module_model_1 = require("../module/module.model");
const course_model_1 = require("./course.model");
const user_model_1 = require("../user/user.model");
const notification_model_1 = require("../notification/notification.model");
const socket_1 = require("../../socket");
const createIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existedCourse = yield course_model_1.Course.findOne({ title: payload.title });
    if (existedCourse) {
        throw new CustomError_1.default(302, "Course title is already exist!");
    }
    // find instructor
    const instructor = yield user_model_1.User.findOne({
        _id: payload.instructor,
        isDeleted: false,
    });
    if (!instructor) {
        throw new CustomError_1.default(302, "Instructor does not exist");
    }
    const slug = (0, utils_1.generateSlug)(payload.title);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const course = new course_model_1.Course(Object.assign(Object.assign({}, payload), { slug: slug }));
        const notification = new notification_model_1.Notification({
            user: course.instructor,
            message: `You have been assigned to ${course.title}`,
            type: "assigned-as-instructor",
        });
        yield course.save({ session });
        yield notification.save({ session });
        const io = (0, socket_1.getIO)();
        io.to(course.instructor.toString()).emit("new-notification", notification);
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        console.log(error);
        throw new CustomError_1.default(400, "Could not create course");
    }
});
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const res = new QueryBuilder_1.default(course_model_1.Course.find({ isDeleted: false }), query)
        .search(["title", "level", "pricingType"])
        .filter()
        .populate({ path: "instructor", select: "name" })
        .sort();
    const courses = yield res.getQuery();
    const meta = yield res.countTotal();
    return { meta, courses };
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield course_model_1.Course.findById(id)
        .populate({ path: "instructor", select: "name avatar" })
        .populate({ path: "category", select: "name" })
        .populate({
        path: "modules",
        populate: {
            path: "lectures",
        },
    });
    if (!data) {
        throw new CustomError_1.default(404, "Course not found!");
    }
    return data;
});
const getBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.aggregate([
        { $match: { slug: slug } },
        {
            $lookup: {
                from: "users",
                localField: "instructor",
                foreignField: "_id",
                as: "instructor",
                pipeline: [
                    { $project: { name: 1, avatar: 1 } }, // Only include name and avatar
                ],
            },
        },
        // Get all modules of this course
        {
            $lookup: {
                from: "modules",
                let: { courseId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$course", "$$courseId"] },
                        },
                    },
                    { $sort: { index: 1 } },
                    // Lookup lectures inside each module
                    {
                        $lookup: {
                            from: "lectures",
                            let: { moduleId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$module", "$$moduleId"],
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        title: 1,
                                        content: 1,
                                        type: 1,
                                        duration: 1,
                                    },
                                },
                            ],
                            as: "lectures",
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            index: 1,
                            lectures: 1,
                        },
                    },
                ],
                as: "modules",
            },
        },
        // Add total lecture count across all modules
        {
            $addFields: {
                totalLectures: {
                    $sum: {
                        $map: {
                            input: "$modules",
                            as: "mod",
                            in: { $size: "$$mod.lectures" },
                        },
                    },
                },
                totalModules: { $size: "$modules" },
            },
        },
        {
            $project: {
                title: 1,
                price: 1,
                description: 1,
                thumbnail: 1,
                instructor: { $arrayElemAt: ["$instructor", 0] },
                modules: 1,
                totalModules: 1,
                totalLectures: 1,
            },
        },
    ]);
    return result[0];
});
const updateDoc = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield course_model_1.Course.findById(id);
    if (!res) {
        throw new CustomError_1.default(404, "Course not found!");
    }
    const slug = (0, utils_1.generateSlug)(payload.title);
    const data = yield course_model_1.Course.findByIdAndUpdate({ _id: id }, {
        $set: Object.assign(Object.assign({}, payload), { slug: slug }),
    }, { new: true, runValidators: true });
    return data;
});
const deleteDoc = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // start session
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        //first transaction -> find course
        const course = yield course_model_1.Course.findById(id).session(session);
        if (!course) {
            yield session.abortTransaction();
            session.endSession();
            throw new CustomError_1.default(404, "Course not found!");
        }
        //second transaction -> find all modules
        const modules = yield module_model_1.Module.find({ course: id }).session(session);
        const moduleIds = modules.map((module) => module._id);
        // third transaction -> Delete all lectures
        yield lecture_model_1.Lecture.updateMany({ module: { $in: moduleIds } }, {
            $set: {
                isDeleted: true,
            },
        }).session(session);
        // forth transaction -> Delete all modules
        yield module_model_1.Module.updateMany({ course: { $in: id } }, {
            $set: {
                isDeleted: true,
            },
        }).session(session);
        // fifth transaction -> Delete course itself
        const res = yield course_model_1.Course.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
            },
        }, { new: true }).session(session);
        //commit transaction
        yield session.commitTransaction();
        session.endSession();
        return res;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new CustomError_1.default(400, "Could not delete course");
    }
});
const popularCourses = () => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield course_model_1.Course.find({ rating: { $gte: 3 } });
    return courses;
});
const getCoursesByInstructorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield course_model_1.Course.find({ instructor: id });
    return courses;
});
exports.courseServices = {
    createIntoDB,
    getAllFromDB,
    getById,
    getBySlug,
    updateDoc,
    deleteDoc,
    popularCourses,
    getCoursesByInstructorId,
};
