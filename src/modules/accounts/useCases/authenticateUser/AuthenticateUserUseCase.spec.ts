import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { UsersTokensRepositoryImMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryImMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

let authenticateUser: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let userTokensRepositoryInMemory: UsersTokensRepositoryImMemory;
let dayjsDateProvider: DayjsDateProvider;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    userTokensRepositoryInMemory = new UsersTokensRepositoryImMemory();
    dayjsDateProvider = new DayjsDateProvider();
    authenticateUser = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      userTokensRepositoryInMemory,
      dayjsDateProvider
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "901234",
      email: "test@test.com",
      name: "test",
      password: "test123",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUser.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    await expect(
      authenticateUser.execute({
        email: "user@test.com",
        password: "123",
      })
    ).rejects.toEqual(new AppError("Email or password invalid!"));
  });

  it("should not be able to authenticate an user with invalid password", async () => {
    const user: ICreateUserDTO = {
      driver_license: "000000",
      email: "test@test.com",
      name: "test",
      password: "test123",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUser.execute({
        email: user.email,
        password: "0000",
      })
    ).rejects.toEqual(new AppError("Email or password invalid!"));
  });
});
