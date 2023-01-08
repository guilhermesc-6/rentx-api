import "reflect-metadata";
import { DataSource } from "typeorm";

import { Car } from "../../../modules/cars/infra/typeorm/entities/Car";
import { User } from "../../../modules/accounts/infra/typeorm/entities/User";
import { Category } from "../../../modules/cars/infra/typeorm/entities/Category";
import { Specification } from "../../../modules/cars/infra/typeorm/entities/Specification";
import { CarImage } from "../../../modules/cars/infra/typeorm/entities/CarImage";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "docker",
  password: "ignite",
  database: "rentx",
  migrations: ["./src/shared/infra/typeorm/migrations/*.{ts,js}"],
  entities: [Category, Specification, User, Car, CarImage]
});
