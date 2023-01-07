import { AppDataSource } from "..";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcryptjs";

async function create(){

  AppDataSource.initialize().then(async () => {
    const id = uuidv4();
    const password = await hash("admin", 8);

    await AppDataSource.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
    VALUES('${id}', 'admin', 'admin@rentx.com', '${password}', true, 'now()', 'XXXXXXXXXXXX')
    `
    );

    console.log("User created!");

    AppDataSource.destroy().then(() => console.log("Connection closed"));
  });

}

create().then(() => console.log("User admin:"));
