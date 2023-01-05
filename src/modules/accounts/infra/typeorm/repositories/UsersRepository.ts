import { Repository } from "typeorm";

import { User } from "../entities/User";
import { AppDataSource } from "@shared/infra/typeorm";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

export class UsersRepository implements IUsersRepository{
  private repository: Repository<User>;

  constructor(){
    this.repository = AppDataSource.getRepository(User);
  }

  async create({name, email, password, driver_license,id, avatar}: ICreateUserDTO): Promise<void> {
    const user = this.repository.create({
      name,
      email,
      password,
      driver_license,
      id,
      avatar
    });

    await this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({where: {email}});

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne({where: {id}});

    return user;
  }

}
