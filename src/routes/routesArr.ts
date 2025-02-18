import { authRoute } from "../modules/auth/auth.route";
import { courseRoute } from "../modules/course/course.route";
import { moduleRoute } from "../modules/module/module.route";

export const routesArray = [
	{ path: "/auth", route: authRoute },

	{ path: "/course", route: courseRoute },
	{ path: "/module", route: moduleRoute },
];
