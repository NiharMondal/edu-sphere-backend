"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoute = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const validateRequest_1 = require("../../middleware/validateRequest");
const review_validation_1 = require("./review.validation");
const authGuard_1 = require("../../middleware/authGuard");
const constant_1 = require("../../constant");
const router = (0, express_1.Router)();
router.get("/:courseId/course-review", review_controller_1.reviewController.getByCourseId);
router.patch("/:id/undo-accept", (0, authGuard_1.authGuard)(constant_1.ROLE.admin), review_controller_1.reviewController.undoAccept);
router.patch("/:id/accept", (0, authGuard_1.authGuard)(constant_1.ROLE.admin), review_controller_1.reviewController.acceptReview);
router
    .route("/:id")
    .get(review_controller_1.reviewController.getById)
    .patch((0, authGuard_1.authGuard)(constant_1.ROLE.admin, constant_1.ROLE.student), (0, validateRequest_1.validateRequest)(review_validation_1.reviewValidation.updateReview), review_controller_1.reviewController.updateDoc)
    .delete((0, authGuard_1.authGuard)(constant_1.ROLE.student, constant_1.ROLE.admin), review_controller_1.reviewController.deleteDoc);
router
    .route("/")
    .post((0, validateRequest_1.validateRequest)(review_validation_1.reviewValidation.createReview), review_controller_1.reviewController.createIntoDB)
    .get(
// authGuard(ROLE.admin),
review_controller_1.reviewController.getAllFromDB);
exports.reviewRoute = router;
