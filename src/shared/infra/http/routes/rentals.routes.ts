import {Router} from "express";

import { CreateRentalController } from "@modules/rentals/useCases/CreateRentalController";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

export const rentalsRoutes =  Router();

const createRentalController = new CreateRentalController();

rentalsRoutes.post("/", ensureAuthenticated,createRentalController.handle);
