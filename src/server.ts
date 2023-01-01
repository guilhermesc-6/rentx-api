import "reflect-metadata";
import express from "express";
import swaggerUi from "swagger-ui-express";

import "./shared/container";

import { router } from "./routes";
import swaggerFile from "./swagger.json";

import { AppDataSource } from "./database";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    const app  = express();

    app.use(express.json());

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

    app.use(router);

    app.listen(3333,()=>console.log("Server is running!"));

  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });


