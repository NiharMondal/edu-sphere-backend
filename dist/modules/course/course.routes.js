"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoute = void 0;
const express_1 = require("express");
const course_controller_1 = require("./course.controller");
const course_validation_1 = require("./course.validation");
const validateRequest_1 = require("../../middleware/validateRequest");
const authGuard_1 = require("../../middleware/authGuard");
const constant_1 = require("../../constant");
const router = (0, express_1.Router)();
//get-courses by instructor id
router.get("/instructor/assigned-course", (0, authGuard_1.authGuard)(constant_1.ROLE.instructor), course_controller_1.courseController.getCoursesByInstructorId);
// popular courses
router.get("/popular-courses", course_controller_1.courseController.popularCourses);
//find by slug
router.get("/by-slug/:slug", course_controller_1.courseController.getBySlug);
// update and delete
router
    .route("/:id")
    .patch((0, authGuard_1.authGuard)(constant_1.ROLE.admin, constant_1.ROLE.instructor), course_controller_1.courseController.updateDoc)
    .delete((0, authGuard_1.authGuard)(constant_1.ROLE.admin), course_controller_1.courseController.deleteDoc);
//find by ID
router.get("/:id", course_controller_1.courseController.getById);
// create and get-all-doc
router
    .route("/")
    .post((0, validateRequest_1.validateRequest)(course_validation_1.courseValidation.createCourse), (0, authGuard_1.authGuard)(constant_1.ROLE.admin), course_controller_1.courseController.createIntoDB)
    .get(course_controller_1.courseController.getAllFromDB);
exports.courseRoute = router;
