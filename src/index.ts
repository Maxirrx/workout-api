import { pool } from "./Infra/Config/db";
import { userRepository } from "./Infra/Repository/UserRepository";
import "reflect-metadata";
import express from "express";
import wmRouter from "./Infra/Http/Route/wm/wm"

async function main() {
  const repository = new userRepository();

  try {
    const users = await repository.findAll();
    console.log(users);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);


const app = express();

app.use(express.json());
app.use("/wm", wmRouter);

export default app;
