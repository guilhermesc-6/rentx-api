import "reflect-metadata";
import request from "supertest";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { AppDataSource } from "@shared/infra/typeorm";

describe("List Available Cars Controller", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    const id = uuidv4();
    const password = await hash("admin", 8);

    await AppDataSource.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      VALUES('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXXXXXXXX')
      `
    );
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });

  it("should be able to list all availables cars", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const { refresh_token } = responseToken.body;

    const { body: category } = await request(app)
      .post("/categories")
      .send({
        name: "category test",
        description: "category test",
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });

    await request(app)
      .post("/cars")
      .send({
        name: "Car test",
        description: "Car test",
        daily_rate: 45,
        license_plate: "dfg-4567",
        fine_amount: 55,
        brand: "Test",
        category_id: category.id,
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });

    const response = await request(app).get("/cars/available");

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toMatchObject({
      name: "Car test",
      description: "Car test",
      daily_rate: 45,
      license_plate: "dfg-4567",
      fine_amount: 55,
      brand: "Test",
    });
  });
});
