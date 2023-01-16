import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 85,
      license_plate: "SDF-4F04",
      fine_amount: 43,
      brand: "brand",
      category_id: "category-id",
    });

    expect(car).toHaveProperty("id");
  });

  it("should not be able create a car with existent license plate", async () => {
    await createCarUseCase.execute({
      name: "Car1",
      description: "Description Car",
      daily_rate: 85,
      license_plate: "SDF-4F04",
      fine_amount: 43,
      brand: "brand",
      category_id: "category-id",
    });

    await expect(createCarUseCase.execute({
      name: "Car2",
      description: "Description Car",
      daily_rate: 85,
      license_plate: "SDF-4F04",
      fine_amount: 43,
      brand: "brand",
      category_id: "category-id",
    })
    ).rejects.toEqual(new AppError("Car already exists!"));
  });

  it("should be able to create a car with available true default", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 85,
      license_plate: "JIO-4F04",
      fine_amount: 43,
      brand: "brand",
      category_id: "category-id",
    });

    expect(car.available).toBe(true);
  });
});
