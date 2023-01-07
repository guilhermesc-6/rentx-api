import { NextFunction, Request, Response } from "express";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "@shared/errors/AppError";

export async function ensureAdmin(request: Request, response: Response, next: NextFunction) {
  const { id } = request.user;

  const usersRepository = new UsersRepository();
  const user = usersRepository.findById(id);

  if(!(await user).isAdmin) {
    throw new AppError("User isn't an admin.");
  }

  return next();

}
