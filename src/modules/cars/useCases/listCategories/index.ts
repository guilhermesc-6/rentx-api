import { CategoriesRepository } from "../../repositories/implementations/CategoriesRepository";
import { ListCategoriesUseCase } from "./ListCategoriesUseCase";
import {  ListCreateCategoryController } from "./ListCategoriesController";

const categoriesRepository = CategoriesRepository.getInstance();
const listCategoriesUseCase = new ListCategoriesUseCase(categoriesRepository);
export const listCreateCategoryController = new ListCreateCategoryController(listCategoriesUseCase);
