import { authRoute } from "../modules/auth/auth.route";
import { courseRoute } from "../modules/course/course.routes";
import { enrollmentRoute } from "../modules/enrollment/enrollment.routes";
import { lectureRoute } from "../modules/lecture/lecture.routes";
import { moduleRoute } from "../modules/module/module.routes";
import { progressRoute } from "../modules/progress/progress.routes";
import { reviewRoute } from "../modules/review/review.routes";
import { userRoute } from "../modules/user/user.routes";

export const routesArray = [
	{ path: "/auth", route: authRoute },
	{ path: "/courses", route: courseRoute },
	{ path: "/modules", route: moduleRoute },
	{ path: "/lectures", route: lectureRoute },
	{ path: "/users", route: userRoute },
	{ path: "/enrollments", route: enrollmentRoute },
	{ path: "/progress", route: progressRoute },
	{ path: "/reviews", route: reviewRoute },
];
