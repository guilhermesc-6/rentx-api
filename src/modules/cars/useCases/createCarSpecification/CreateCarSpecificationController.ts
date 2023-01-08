import { container } from "tsyringe";
import { Request, Response } from "express";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

export class CreateCarSpecificationController {
  async handle(request: Request, response: Response ): Promise<Response> {
    const { id } = request.params;
    const { specifications_id } = request.body;

    const createCarSpecificatinUseCase = container.resolve(CreateCarSpecificationUseCase);

    const car = await createCarSpecificatinUseCase.execute({ car_id: id, specifications_id});

    return response.json(car);
  }
}
