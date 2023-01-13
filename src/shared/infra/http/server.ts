import "reflect-metadata";
import { AppDataSource } from "../typeorm";

import { app } from "./app";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    app.listen(3333, () => console.log("Server is running!"));
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
