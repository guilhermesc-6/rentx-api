import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
  });

  it("should be able to list all available cars", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car1",
      description: "Car description",
      daily_rate: 75.0,
      license_plate: "EFG-3h45",
      fine_amount: 18.5,
      brand: "Car brand",
      category_id: "category-id",
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car test",
      description: "Car description",
      daily_rate: 75.0,
      license_plate: "EFG-3h45",
      fine_amount: 18.5,
      brand: "Car brand",
      category_id: "category-id",
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car test"
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by brand", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car test",
      description: "Car description",
      daily_rate: 75.0,
      license_plate: "EFG-3K56",
      fine_amount: 18.5,
      brand: "Car brand",
      category_id: "category-id",
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: "Car brand"
    });


    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by category", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car test",
      description: "Car description",
      daily_rate: 75.0,
      license_plate: "EFG-0K09",
      fine_amount: 18.5,
      brand: "Car brand",
      category_id: "category-id",
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "category-id"
    });

    expect(cars).toEqual([car]);
  });
});
