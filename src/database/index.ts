import "reflect-metadata";
import { DataSource } from "typeorm";
import { Category } from "../modules/cars/entities/Category";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "docker",
  password: "ignite",
  database: "rentx",
  migrations: ["./src/database/migrations/*.{ts,js}"],
  entities: [Category]
});
