import { User } from "../../Domain/Entity/User";
import { pool } from "../Link/db";

export abstract class IUserRepository {
    abstract findByEmail(email: string): Promise<User | undefined>
    abstract findByName(name: string) : Promise<User | undefined>
}

export class userRepository implements IUserRepository{
    async findByEmail (email: string): Promise<User | undefined> {
        const result = await pool.query("Select * from users where email like $1",
            email
        )
        if (result.rows.length === 0) {
            return undefined
        }
        return new User(
            result.rows[0].name,
            result.rows[0].email,
            result.rows[0].password
        )
    }

    async findByName(name: string): Promise<User | undefined>{
        const result = await pool.query("Select * from users where name like $1",
            name
        )
        if (result.rows.length === 0) {
            return undefined
        }
        return new User(
            result.rows[0].name,
            result.rows[0].email,
            result.rows[0].password
        )
    }
}