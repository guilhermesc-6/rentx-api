import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
  sub: string
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction){
  const authHeader = request.headers.authorization;

  if(!authHeader){
    throw new Error("Token missing!");
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, "69c6e4a394b794ac45a4ca63761bff01") as IPayload;

    const userRepository = new UsersRepository();
    const user = await userRepository.findById(user_id);

    if(!user){
      throw new Error("User dos not exists!");
    }

    next();

  } catch {
    throw new Error("Invalid token!");
  }
}
