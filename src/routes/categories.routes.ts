import { Router} from "express";
import { CategoriesRepository } from "../repositories/CategoriesRepository";

export const categoriesRoutes = Router();

const categotiesRepositories = new CategoriesRepository();

categoriesRoutes.post("/",(request,response)=>{
  const {name,description}=request.body;

  const categoryAlreadyExists = categotiesRepositories.findByName(name);

  if(categoryAlreadyExists){
    return response.status(400).json({message: "Category already exists!"});
  }

  categotiesRepositories.create({name,description});

  return response.status(201).send();
});

categoriesRoutes.get("/",(request,response)=>{

  const all= categotiesRepositories.list();

  return response.json(all);
});
