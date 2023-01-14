import { CarsRepository } from "@modules/cars/infra/typeorm/repositories/CarsRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";
import { RentalRepositoryInMemory } from "./../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let carsRepository: CarsRepository;

describe("Create Rental", () => {
  const dayAdd24Hours = new Date(Date.now() + 87400000 /* 1 day */);

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    carsRepository = new CarsRepository();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dateProvider,
      carsRepository
    );
  });

  it("should be able to create a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      car_id: "12345",
      user_id: "235234",
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if already exist a open rental to the car", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "12345",
        user_id: "1111111",
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        car_id: "12345",
        user_id: "235234",
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a rental if already exist a open rental to user", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "12345",
        user_id: "1111111",
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        car_id: "22232332",
        user_id: "1111111",
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a rental if return date is less than 24 hours", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "22232332",
        user_id: "1111111",
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
