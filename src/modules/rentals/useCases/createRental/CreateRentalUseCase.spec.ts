import { AppError } from "@shared/errors/AppError";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { RentalRepositoryInMemory } from "./../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarRepositoryInMemory";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Rental", () => {
  const dayAdd24Hours = new Date(Date.now() + 87400000 /* 1 day */);

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dateProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car test",
      description: "Test",
      brand: "Test",
      category_id: "test",
      daily_rate: 30,
      fine_amount: 10,
      license_plate: "test-123",
    });
    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: "1232",
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if already exist a open rental to the car", async () => {
    await rentalsRepositoryInMemory.create({
      car_id: "12345",
      user_id: "11111112",
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: "12345",
        user_id: "235234",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("Car is not available!"));
  });

  it("should not be able to create a rental if already exist a open rental to user", async () => {
    await rentalsRepositoryInMemory.create({
      car_id: "123456",
      user_id: "1111111",
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: "22232332",
        user_id: "1111111",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it("should not be able to create a rental if return date is less than 24 hours", async () => {
    await expect(
      createRentalUseCase.execute({
        car_id: "22232332",
        user_id: "1111111",
        expected_return_date: new Date(),
      })
    ).rejects.toEqual(new AppError("Invalid return time!"));
  });
});
