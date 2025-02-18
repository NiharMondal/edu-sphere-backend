import { Router } from "express";
import { routesArray } from "./routesArr";

const rootRoutes = Router();

routesArray.forEach((el) => rootRoutes.use(el.path, el.route));

export default rootRoutes;
