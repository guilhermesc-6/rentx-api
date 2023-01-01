import { Router} from "express";
import multer from "multer";

import {CreateCategoryController}  from "../modules/cars/useCases/createCategory/CreateCategoryController";
import { ImportCategoryController } from "../modules/cars/useCases/importCategory/ImportCategoryController";
import { ListCreateCategoryController } from "../modules/cars/useCases/listCategories/ListCategoriesController";

export const categoriesRoutes = Router();

const upload = multer({
  dest: "./tmp",
});

const createCategoryController = new CreateCategoryController();
const listCreateCategoryController = new ListCreateCategoryController();
const importCategoryController = new ImportCategoryController();

categoriesRoutes.post("/", createCategoryController.handle);

categoriesRoutes.get("/", listCreateCategoryController.handle
);

categoriesRoutes.post("/import", upload.single("file"), importCategoryController.handle);
