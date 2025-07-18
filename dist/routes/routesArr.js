"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesArray = void 0;
const auth_route_1 = require("../modules/auth/auth.route");
const category_routes_1 = require("../modules/category/category.routes");
const course_routes_1 = require("../modules/course/course.routes");
const enrollment_routes_1 = require("../modules/enrollment/enrollment.routes");
const lecture_routes_1 = require("../modules/lecture/lecture.routes");
const meta_data_route_1 = require("../modules/meta-data/meta-data.route");
const module_routes_1 = require("../modules/module/module.routes");
const notification_routes_1 = require("../modules/notification/notification.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
const progress_routes_1 = require("../modules/progress/progress.routes");
const review_routes_1 = require("../modules/review/review.routes");
const user_routes_1 = require("../modules/user/user.routes");
exports.routesArray = [
    { path: "/auth", route: auth_route_1.authRoute },
    { path: "/courses", route: course_routes_1.courseRoute },
    { path: "/categories", route: category_routes_1.categoryRoute },
    { path: "/enrollments", route: enrollment_routes_1.enrollmentRoute },
    { path: "/lectures", route: lecture_routes_1.lectureRoute },
    { path: "/modules", route: module_routes_1.moduleRoute },
    { path: "/progress", route: progress_routes_1.progressRoute },
    { path: "/reviews", route: review_routes_1.reviewRoute },
    { path: "/users", route: user_routes_1.userRoute },
    { path: "/payments", route: payment_routes_1.paymentRoute },
    { path: "/meta-data", route: meta_data_route_1.metaRoute },
    { path: "/notifications", route: notification_routes_1.notificationRoute },
];
