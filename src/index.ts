
import "reflect-metadata";
import express from "express";
import { pool } from "./Infra/Config/db";
import wmRouter from "./Infra/Http/Route/wm/wm";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/wm", wmRouter);

async function main(): Promise<void> {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connecté");

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("Erreur de connexion PostgreSQL :", error);
    process.exit(1);
  }
}

void main();

export default app;
