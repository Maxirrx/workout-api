import { User } from "../../Domain/Entity/User";
import { pool } from "../Config/db";

export abstract class IUserRepository {
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract findByName(name: string): Promise<User | undefined>;
  abstract findById(name: string): Promise<User | undefined>;
  abstract findAll(): Promise<User[] | undefined>;
  abstract create(user: User): Promise<User>;
}

export class userRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await pool.query("Select * from users where email = $1", [email]);
      if (result.rows.length === 0) {
        return undefined;
      }
      return new User(result.rows[0].name, result.rows[0].email, result.rows[0].password);
    } catch (e) {
      throw new Error("Erreur Database [UserRepository findByEmail]\n" + e);
    }
  }

  async findByName(name: string): Promise<User | undefined> {
    try {
      const result = await pool.query("Select * from users where name = $1", [name]);
      if (result.rows.length === 0) {
        return undefined;
      }
      return new User(result.rows[0].name, result.rows[0].email, result.rows[0].password);
    } catch (e) {
      throw new Error("Erreur Database [UserRepository findByName]\n" + e);
    }
  }

  async findById(id: string): Promise<User | undefined> {
    try {
      const result = await pool.query("Select * from users where id = $1", [id]);
      if (result.rows.length === 0) {
        return undefined;
      }
      return new User(result.rows[0].name, result.rows[0].email, result.rows[0].password);
    } catch (e) {
      throw new Error("Erreur Database [UserRepository findById] \n" + e);
    }
  }

  async findAll(): Promise<User[] | undefined> {
    try {
      const result = await pool.query("Select * from users");
      if (result.rows.length === 0) {
        return undefined;
      }
      const users: User[] = [];
      result.rows.forEach((row) => {
        const user = new User(row.name, row.email, row.password);
        users.push(user);
      });
      return users;
    } catch (e) {
      throw new Error("Erreur Database [UserRepository findAll] \n" + e);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const query = `INSERT INTO users (name, email, password)VALUES ($1, $2, $3)
            RETURNING id, name, email, password, email_verified_at`;

      const values = [user.name, user.email, user.password];

      const result = await pool.query(query, values);

      return new User(result.rows[0].name, result.rows[0].email, result.rows[0].password);
    } catch (e) {
      throw new Error("Erreur Database [UserRepository create] \n" + e);
    }
  }
}
