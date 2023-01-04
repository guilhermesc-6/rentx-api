import fs from "node:fs";
import { parse } from "csv-parse";
import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";

interface IImportCategory{
  name: string;
  description: string;
}

@injectable()
export class ImportCategoryUseCase{
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ){}

  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]>{
    return new Promise((resolve, rejects)=>{
      const stream = fs.createReadStream(file.path);
      const categories: IImportCategory[] = [];

      const parseFile = parse();

      stream.pipe(parseFile);

      parseFile.on("data", (line) => {
        const [name, description] = line;
        categories.push({
          name,
          description
        });
      })
        .on("end",()=>{
          fs.promises.unlink(file.path);
          resolve(categories);
        })
        .on("end",(err)=>{
          rejects(err);
        });
    });
  }

  async execute(file: Express.Multer.File): Promise<void>{
    const categories = await this.loadCategories(file);

    categories.map(async(category)=>{
      const {name, description} = category;

      const existsCategory = await this.categoriesRepository.findByName(name);

      if(!existsCategory){
        await this.categoriesRepository.create({
          name,
          description
        });
      }
    });

  }
}
