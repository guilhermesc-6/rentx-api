import { compare } from "bcryptjs";
import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@errors/AppError";


interface IRequest{
  email: string;
  password: string;
}

interface IResponse{
  user: {
    name: string;
    email: string
  };
  token: string
}

@injectable()
export class AuthenticateUserUseCase{
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ){}

  async execute({email, password}: IRequest): Promise<IResponse> {
    const user= await this.usersRepository.findByEmail(email);

    if(!user){
      throw new AppError("Email or password invalid!");
    }

    const passwordMatch = await compare(password, user.password);

    if(!passwordMatch){
      throw new AppError("Email or password invalid!");
    }

    const token = sign({}, "69c6e4a394b794ac45a4ca63761bff01",{
      subject: user.id,
      expiresIn: "1d"
    });

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email
      }
    };

    return tokenReturn;
  }
}
