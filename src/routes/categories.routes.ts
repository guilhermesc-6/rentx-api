import { Router} from "express";

import { createCategoryController } from "../modules/cars/useCases/createCategory";
import { listCreateCategoryController } from "../modules/cars/useCases/listCategories";

export const categoriesRoutes = Router();

categoriesRoutes.post("/",(request, response) => {
  return createCategoryController.handle(request, response);
});

categoriesRoutes.get("/",(request,response)=>{
  return listCreateCategoryController.handle(request, response);

});
