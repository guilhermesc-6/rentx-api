import { Router } from "express";

import { carsRoutes } from "./cars.routes";
import { usersRoutes } from "./users.routes";
import { rentalsRoutes } from "./rentals.routes";
import { categoriesRoutes } from "./categories.routes";
import { authenticateRoutes } from "./authenticate.routes";
import { specificationsRoutes } from "./specifications.routes";

export const router = Router();

router.use("/categories",categoriesRoutes);
router.use("/specifications", specificationsRoutes);
router.use("/users", usersRoutes);
router.use("/cars", carsRoutes);
router.use("/rentals", rentalsRoutes);
router.use(authenticateRoutes);
