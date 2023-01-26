import { Repository } from "typeorm";

import { UserTokens } from "../entities/UserTokens";
import { AppDataSource } from "@shared/infra/typeorm";
import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";

export class UsersTokenRepository implements IUsersTokensRepository {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserTokens);
  }

  async create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      expires_date,
      refresh_token,
      user_id,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    const userToken = await this.repository.findOne({
      where: { user_id, refresh_token },
    });
    return userToken;
  }

  async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
    const userToken = await this.repository.findOne({
      where: { refresh_token },
    });

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
