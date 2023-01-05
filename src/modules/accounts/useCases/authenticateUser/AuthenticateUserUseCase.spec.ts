import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


let authenticateUser: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUser = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase= new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "901234",
      email: "test@test.com",
      name: "test",
      password: "test123"
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUser.execute({
      email: user.email,
      password: user.password
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistent user", async () => {

    expect(async () => {
      await authenticateUser.execute({
        email: "user@test.com",
        password: "123"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate an user with invalid password", async () => {

    expect(async () => {
      const user: ICreateUserDTO = {
        driver_license: "000000",
        email: "test@test.com",
        name: "test",
        password: "test123"
      };

      await createUserUseCase.execute(user);

      await authenticateUser.execute({
        email: user.email,
        password: "0000"
      });
    }).rejects.toBeInstanceOf(AppError);

  });

});
