import { Image } from "../../Domain/Entity/Image";
import { Role } from "../../Domain/Entity/Role";
import { User } from "../../Domain/Entity/User";
import { IUserRepository } from "../../Domain/Port/Out/Repository/IUserRepository";
import { pool } from "../Config/db";

import { ExerciceRepository } from "./ExerciceRepository";
import { WorkoutTemplateRepository } from "./WorkoutTemplateRepository";

export class userRepository implements IUserRepository {
  private readonly selectUser = `SELECT u.*, i.url AS picture_url,
    ARRAY(SELECT json_build_object('id', r.id::text, 'name', r.name, 'app_id', r.app_id)
      FROM user_roles ur JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = u.id ORDER BY r.id) AS roles
    FROM users u LEFT JOIN images i ON i.id = u.picture_id`;

  private makeUser(row: Record<string, any>): User {
    const roles = (row.roles as Role[]).map((role) => new Role(Number(role.id), role.name, role.app_id));
    const picture = row.picture_id == null ? null : new Image(Number(row.picture_id), row.picture_url);
    return new User(Number(row.id), row.name, row.email, row.password, row.is_public, row.is_enable, roles, row.phone, picture, row.email_verified_at);
  }

  private async makeUserWithRelations(row: Record<string, any>): Promise<User> {
    const user = this.makeUser(row);
    const users = { findById: (id: number) => this.findReferenceById(id) };
    const templates = new WorkoutTemplateRepository(users, new ExerciceRepository(users));
    const [friends, favorites] = await Promise.all([
      pool.query(`${this.selectUser} JOIN friends f ON f.friend_id = u.id WHERE f.user_id = $1 ORDER BY f.created_at, u.id`, [user.id]),
      pool.query("SELECT workout_template_id FROM favorites WHERE user_id = $1 ORDER BY created_at, workout_template_id", [user.id])
    ]);

    user.friends = friends.rows.map((friend) => this.makeUser(friend));
    user.favorites = await Promise.all(favorites.rows.map((favorite) => templates.findById(Number(favorite.workout_template_id))));
    return user;
  }

  private async findReferenceById(id: number): Promise<User | undefined> {
    const { rows } = await pool.query(`${this.selectUser} WHERE u.id = $1`, [id]);
    return rows[0] && this.makeUser(rows[0]);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await pool.query(`${this.selectUser} WHERE u.email = $1`, [email]);
      if (result.rows.length === 0) {
        return undefined;
      }
      const row = result.rows[0];
      return await this.makeUserWithRelations(row);
    } catch (e) {
      throw new Error("Erreur Database [UserRepository findByEmail]\n" + e);
    }
  }

  async findByName(name: string): Promise<User | undefined> {
    try {
      const result = await pool.query(`${this.selectUser} WHERE u.name = $1`, [name]);
      if (result.rows.length === 0) {
        return undefined;
      }
      const row = result.rows[0];
      return await this.makeUserWithRelations(row);
    } catch (e) {
      throw new Error("Erreur Database [UserRepository findByName]\n" + e);
    }
  }

  async findById(id: number): Promise<User | undefined> {
    try {
      const result = await pool.query(`${this.selectUser} WHERE u.id = $1`, [id]);
      if (result.rows.length === 0) {
        return undefined;
      }
      const row = result.rows[0];
      return await this.makeUserWithRelations(row);
    } catch (e) {
      throw new Error("Erreur Database [UserRepository findById] \n" + e);
    }
  }

  async findAll(): Promise<User[] | undefined> {
    try {
      const result = await pool.query(this.selectUser);
      if (result.rows.length === 0) {
        return undefined;
      }
      return await Promise.all(result.rows.map((row) => this.makeUserWithRelations(row)));
    } catch (e) {
      throw new Error("Erreur Database [UserRepository findAll] \n" + e);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const query = `WITH created AS (
        INSERT INTO users (name, email, password, phone, picture_id, email_verified_at)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
      ), assigned_roles AS (
        INSERT INTO user_roles (user_id, role_id)
        SELECT created.id, role_id FROM created CROSS JOIN unnest($7::bigint[]) AS roles(role_id)
        ON CONFLICT DO NOTHING
      )
      SELECT id FROM created`;

      const values = [user.name, user.email, user.password, user.phone, user.picture?.id, user.email_verified_at, user.roles?.map((role) => role.id)];

      const result = await pool.query(query, values);

      const row = result.rows[0];

      const saved = await this.findById(Number(row.id));
      if (!saved) {
        throw new Error("Utilisateur introuvable");
      }
      return saved;
    } catch (e) {
      throw new Error("Erreur Database [UserRepository create] \n" + e);
    }
  }
  async update(user: User): Promise<User> {
    try {
      const query = `WITH updated AS (
        UPDATE users SET name = $1, email = $2, password = $3, is_public = $4, is_enable = $5,
          phone = CASE WHEN $6 THEN $7 ELSE phone END,
          picture_id = CASE WHEN $8 THEN $9 ELSE picture_id END,
          email_verified_at = CASE WHEN $10 THEN $11 ELSE email_verified_at END
        WHERE id = $12 RETURNING id
      ), removed_roles AS (
        DELETE FROM user_roles USING updated
        WHERE user_roles.user_id = updated.id AND $13::bigint[] IS NOT NULL
          AND NOT (user_roles.role_id = ANY($13))
      ), assigned_roles AS (
        INSERT INTO user_roles (user_id, role_id)
        SELECT updated.id, role_id FROM updated CROSS JOIN unnest($13::bigint[]) AS roles(role_id)
        ON CONFLICT DO NOTHING
      )
      SELECT id FROM updated`;

      const values = [
        user.name,
        user.email,
        user.password,
        user.is_public,
        user.is_enable,
        user.phone !== undefined,
        user.phone,
        user.picture !== undefined,
        user.picture?.id,
        user.email_verified_at !== undefined,
        user.email_verified_at,
        user.id,
        user.roles?.map((role) => role.id)
      ];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error("Utilisateur introuvable");
      }

      const row = result.rows[0];

      const saved = await this.findById(Number(row.id));
      if (!saved) {
        throw new Error("Utilisateur introuvable");
      }
      return saved;
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
