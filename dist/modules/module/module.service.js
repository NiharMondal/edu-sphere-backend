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
exports.moduleServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const course_model_1 = require("../course/course.model");
const lecture_model_1 = require("../lecture/lecture.model");
const module_model_1 = require("./module.model");
const utils_1 = require("../../utils");
const enrollment_model_1 = require("../enrollment/enrollment.model");
const notification_model_1 = require("../notification/notification.model");
const socket_1 = require("../../socket");
const QueryBuilder_1 = __importDefault(require("../../lib/QueryBuilder"));
const createIntoDB = (courseId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // double checking by courseId and params
    const course = yield course_model_1.Course.findOne({
        $and: [{ _id: courseId }, { _id: payload.course }],
    });
    if (!course) {
        throw new CustomError_1.default(404, "Requested course is not found!");
    }
    const module = yield module_model_1.Module.findOne({
        title: payload.title,
        course: payload.course,
    });
    if (module) {
        throw new CustomError_1.default(400, "Title should be unique");
    }
    const lastModule = yield module_model_1.Module.findOne({ course: payload.course }).sort({
        index: -1,
    });
    const newIndex = lastModule ? lastModule.index + 1 : 1;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const module = new module_model_1.Module(Object.assign(Object.assign({}, payload), { index: newIndex }));
        yield module.save({ session }); //first step
        const enrollments = yield enrollment_model_1.Enrollment.find({
            course: payload.course,
        }).session(session); // second step: this step is for creating notification
        for (const enrollment of enrollments) {
            const notification = new notification_model_1.Notification({
                user: enrollment.student,
                message: `Module ${module.index}: ${module.title} has been released`,
                type: "module-update",
            });
            yield notification.save({ session }); // third step: saving notifications
            const io = (0, socket_1.getIO)();
            io.to(enrollment.student.toString()).emit("new-notification", notification);
        }
        yield course_model_1.Course.findByIdAndUpdate({ _id: module.course }, {
            $push: {
                modules: module._id,
            },
        }, { new: true, runValidators: true }).session(session); // forth step: saving modules to course model
        yield session.commitTransaction();
        yield session.endSession();
        return module;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        console.log(error);
        throw new CustomError_1.default(400, "Could not create module");
    }
});
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(module_model_1.Module.find(), query)
        .search(["title"])
        .sort()
        .pagination()
        .fields()
        .populate({
        path: "course",
        select: "title",
    })
        .populate("lectures");
    const modules = yield queryBuilder.getQuery();
    const meta = yield queryBuilder.countTotal();
    return { modules, meta };
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield module_model_1.Module.findById(id).populate({ path: "lectures" });
    if (!data) {
        throw new CustomError_1.default(404, "Module not found!");
    }
    return data;
});
// by course Id
const getByCourseId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield module_model_1.Module.find({ course: id });
    if (!data) {
        throw new CustomError_1.default(404, "Course not found!");
    }
    return data;
});
const updateDoc = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const module = yield module_model_1.Module.findById(id);
    if (!module) {
        throw new CustomError_1.default(404, "Module not found!");
    }
    const slug = (0, utils_1.generateSlug)(payload === null || payload === void 0 ? void 0 : payload.title);
    const data = yield module_model_1.Module.findByIdAndUpdate({ _id: id }, {
        $set: Object.assign(Object.assign({}, payload), { slug }),
    }, { new: true, runValidators: true });
    return data;
});
const deleteDoc = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield module_model_1.Module.findById(id);
    if (!res) {
        throw new CustomError_1.default(404, "Module not found!");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        //delete lectures based on module id
        yield lecture_model_1.Lecture.deleteMany({ module: id }).session(session); // id refers to module id
        //updating course module array
        yield course_model_1.Course.findByIdAndUpdate(res.course, {
            $pull: { modules: id },
        }).session(session);
        //deleting module
        const data = yield module_model_1.Module.findByIdAndDelete(id).session(session);
        //commit session
        yield session.commitTransaction();
        session.endSession();
        return data;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new CustomError_1.default(500, "Could not delete module");
    }
});
const assignedModuleToInstructor = (insId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield course_model_1.Course.find({ instructor: insId });
    const courseIds = courses.map((c) => c._id);
    const qb = new QueryBuilder_1.default(module_model_1.Module.find({ course: { $in: courseIds } }), query)
        .search(["title"])
        .sort()
        .pagination()
        .fields()
        .populate([{ path: "course", select: "title" }, { path: "lectures" }]);
    const modules = yield qb.getQuery();
    const meta = yield qb.countTotal();
    return { modules, meta };
});
exports.moduleServices = {
    createIntoDB,
    getAllFromDB,
    getById,
    getByCourseId,
    updateDoc,
    deleteDoc,
    assignedModuleToInstructor,
};
