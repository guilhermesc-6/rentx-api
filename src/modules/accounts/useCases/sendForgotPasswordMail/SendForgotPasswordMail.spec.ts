import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryImMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryImMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryImMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe("Send Forgot Password", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryImMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
    jest.restoreAllMocks();
  });

  it("should be able to send a forgot password mail to user", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendEmail");

    await usersRepositoryInMemory.create({
      driver_license: "0000000",
      email: "john@doe.com",
      name: "John Doe",
      password: "123",
    });

    await sendForgotPasswordMailUseCase.execute("john@doe.com");

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not be able to send an e-mail if user dos not exist", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("john@john.com")
    ).rejects.toEqual(new AppError("User does not exist!"));
  });

  it("should be able to create an users token", async () => {
    const generateTokenMail = jest.spyOn(
      usersTokensRepositoryInMemory,
      "create"
    );

    await usersRepositoryInMemory.create({
      driver_license: "0000000",
      email: "john@doe.com",
      name: "John Doe",
      password: "123",
    });

    await sendForgotPasswordMailUseCase.execute("john@doe.com");

    expect(generateTokenMail).toHaveBeenCalled();
  });
});
