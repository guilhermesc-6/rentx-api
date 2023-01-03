import { Repository } from "typeorm";

import {  IUsersRepository } from "../IUsersRepository";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../entities/User";
import { AppDataSource } from "../../../../database";


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
