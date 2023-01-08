import { AppError } from "@shared/errors/AppError";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe("Create Car Specification", () => {

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(carsRepositoryInMemory, specificationsRepositoryInMemory);
  });

  it("should be able to add new specification to the car", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car1",
      description: "Car description",
      daily_rate: 75.0,
      license_plate: "EFG-3h45",
      fine_amount: 18.5,
      brand: "Car brand",
      category_id: "category-id",
    });

    const specification = await specificationsRepositoryInMemory.create({
      name: "test",
      description: "test"
    });

    const specifications_id = [specification.id];

    const carSpecification = await createCarSpecificationUseCase.execute({car_id: car.id, specifications_id});


    expect(carSpecification).toHaveProperty("specifications");
    expect(carSpecification.specifications).toContain(specification);
  });

  it("should not be able to add new specification to a non existent car", async () => {
    expect(async () => {
      const car_id = "1234";
      const specifications_id = ["0987"];

      await createCarSpecificationUseCase.execute({car_id, specifications_id});
    }).rejects.toBeInstanceOf(AppError);
  });
});
