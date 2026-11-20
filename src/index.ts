import { pool } from "./Infra/Config/db";
import { userRepository } from "./Infra/Repository/UserRepository";

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