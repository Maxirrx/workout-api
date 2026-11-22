import { User } from "../../Domain/Entity/User";
import { IUserRepository } from "../../Domain/Port/Out/Repository/IUserRepository";
import { pool } from "../Config/db";

export class userRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await pool.query("Select * from users where email = $1", [email]);
      if (result.rows.length === 0) {
        return undefined;
      }
      const row = result.rows[0];
      return new User(row[0].id, row[0].name, row[0].email, row[0].password, row[0].is_public, row[0].is_enable);
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
      const row = result.rows[0];
      return new User(row[0].id, row[0].name, row[0].email, row[0].password, row[0].is_public, row[0].is_enable);
    } catch (e) {
      throw new Error("Erreur Database [UserRepository findByName]\n" + e);
    }
  }

  async findById(id: number): Promise<User | undefined> {
    try {
      const result = await pool.query("Select * from users where id = $1", [id]);
      if (result.rows.length === 0) {
        return undefined;
      }
      const row = result.rows[0];
      return new User(row[0].id, row[0].name, row[0].email, row[0].password, row[0].is_public, row[0].is_enable);
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
        const user = new User(row.id, row.name, row.email, row.password, row.is_public, row.is_enable);
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

      const row = result.rows[0];

      return new User(row[0].id, row[0].name, row[0].email, row[0].password, row[0].is_public, row[0].is_enable);
    } catch (e) {
      throw new Error("Erreur Database [UserRepository create] \n" + e);
    }
  }
  async update(user: User): Promise<User> {
    try {
      const query = `UPDATE users SET name = $1, email = $2, password = $3, is_public = $4, is_enable = $5 WHERE id = $6 RETURNING *`;

      const values = [user.name, user.email, user.password, user.is_public, user.is_enable, user.id];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error("Utilisateur introuvable");
      }

      const row = result.rows[0];

      return new User(row.id, row.name, row.email, row.password, row.is_public, row.is_enable);
    } catch (e) {
      throw new Error("Erreur Database [UserRepository update]\n" + e);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = ` DELETE FROM users WHERE id = $1 RETURNING id`;

      const result = await pool.query(query, [id]);

      return result.rows.length > 0;
    } catch (e) {
      throw new Error("Erreur Database [UserRepository delete]\n" + e);
    }
  }

  async disable(id: number): Promise<boolean> {
    try {
      const query = ` UPDATE users SET is_enable = FALSE WHERE id = $1 AND is_enable = TRUE RETURNING id
    `;

      const result = await pool.query(query, [id]);

      return result.rows.length > 0;
    } catch (e) {
      throw new Error("Erreur Database [UserRepository disable]\n" + e);
    }
  }

  async enable(id: number): Promise<boolean> {
    try {
      const query = ` UPDATE users SET is_enable = FALSE WHERE id = $1 AND is_enable = FALSE RETURNING id
    `;

      const result = await pool.query(query, [id]);

      return result.rows.length > 0;
    } catch (e) {
      throw new Error("Erreur Database [UserRepository enable]\n" + e);
    }
  }
}
