"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoute = void 0;
const express_1 = require("express");
const course_controller_1 = require("./course.controller");
const course_validation_1 = require("./course.validation");
const validateRequest_1 = require("../../middleware/validateRequest");
const router = (0, express_1.Router)();
// update and delete
router
    .route("/:id")
    .patch(course_controller_1.courseController.updateDoc)
    .delete(course_controller_1.courseController.deleteDoc);
//find by slug
router.get("/slug/:slug", course_controller_1.courseController.getBySlug);
//find by ID
router.get("/:id", course_controller_1.courseController.getById);
// create and get-all-doc
router
    .route("/")
    .post((0, validateRequest_1.validateRequest)(course_validation_1.courseValidation.createCourse), course_controller_1.courseController.createIntoDB) // only admin can create course
    .get(course_controller_1.courseController.getAllFromDB);
exports.courseRoute = router;
