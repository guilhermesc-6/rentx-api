import "reflect-metadata";
import { DataSource } from "typeorm";

import { Car } from "../../../modules/cars/infra/typeorm/entities/Car";
import { User } from "../../../modules/accounts/infra/typeorm/entities/User";
import { Category } from "../../../modules/cars/infra/typeorm/entities/Category";
import { Specification } from "../../../modules/cars/infra/typeorm/entities/Specification";
import { CarImage } from "../../../modules/cars/infra/typeorm/entities/CarImage";
import { Rental } from "../../../modules/rentals/infra/typeorm/entities/Rental";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "docker",
  password: "ignite",
  database: process.env.NODE_ENV === "test" ? "rentx_test" : "rentx",
  migrations: ["./src/shared/infra/typeorm/migrations/*.{ts,js}"],
  entities: [Category, Specification, User, Car, CarImage, Rental]
});
