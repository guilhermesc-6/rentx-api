import * as dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import "@shared/container";
import upload from "@config/upload";

import { router } from "@shared/infra/http/routes";
import swaggerFile from "../../../swagger.json";
import { AppError } from "@shared/errors/AppError";

export const app = express();

app.use(express.json());

app.use("/avatar",express.static(`${upload.tmpFolder}/avatar`));
app.use("/cars",express.static(`${upload.tmpFolder}/cars`));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  }
);
