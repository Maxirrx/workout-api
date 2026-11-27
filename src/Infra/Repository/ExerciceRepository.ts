import { Exercice } from "../../Domain/Entity/Exercice";
import { Muscle } from "../../Domain/Entity/Muscle";
import { User } from "../../Domain/Entity/User";
import { IExerciceRepository } from "../../Domain/Port/Out/Repository/IExerciceRepository";
import { pool } from "../Config/db";

export class ExerciceRepository implements IExerciceRepository {
  async findById(id: number): Promise<Exercice | undefined> {
    try {
      const query = `SELECT e.*, m1.name AS muscle_1_name, m2.name AS muscle_2_name, m3.name AS muscle_3_name, u.name AS user_name, u.email AS user_email, u.password AS user_password, u.is_public AS user_is_public, u.is_enable AS user_is_enable 
      FROM exercises e JOIN muscles m1 ON e.muscle_1_id = m1.id 
      LEFT JOIN muscles m2 ON e.muscle_2_id = m2.id 
      LEFT JOIN muscles m3 ON e.muscle_3_id = m3.id JOIN users u ON e.user_id = u.id WHERE e.id = $1`;

      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return undefined;
      }

      const row = result.rows[0];

      return new Exercice(
        row.id,
        row.name,
        new Muscle(row.muscle_1_id, row.muscle_1_name),
        row.muscle_2_id ? new Muscle(row.muscle_2_id, row.muscle_2_name) : undefined,
        row.muscle_3_id ? new Muscle(row.muscle_3_id, row.muscle_3_name) : undefined,
        new User(row.user_id, row.user_name, row.user_email, row.user_password, row.user_is_public, row.user_is_enable),
        row.is_public
      );
    } catch (e) {
      throw new Error("Erreur Database [ExerciceRepository findById]\n" + e);
    }
  }

  async findAll(): Promise<Exercice[]> {
    try {
      const query = `SELECT e.*, m1.name AS muscle_1_name, m2.name AS muscle_2_name, m3.name AS muscle_3_name, u.name AS user_name, u.email AS user_email, u.password AS user_password, u.is_public AS user_is_public, u.is_enable AS user_is_enable
        FROM exercises e
        JOIN muscles m1 ON e.muscle_1_id = m1.id
        LEFT JOIN muscles m2 ON e.muscle_2_id = m2.id
        LEFT JOIN muscles m3 ON e.muscle_3_id = m3.id
        JOIN users u ON e.user_id = u.id
      `;

      const result = await pool.query(query);

      if (result.rows.length === 0) {
        return [];
      }

      const exercices: Exercice[] = [];

      result.rows.forEach((row) => {
        const exercice = new Exercice(
          row.id,
          row.name,
          new Muscle(row.muscle_1_id, row.muscle_1_name),
          row.muscle_2_id ? new Muscle(row.muscle_2_id, row.muscle_2_name!) : undefined,
          row.muscle_3_id ? new Muscle(row.muscle_3_id, row.muscle_3_name!) : undefined,
          new User(row.user_id, row.user_name, row.user_email, row.user_password, row.user_is_public, row.user_is_enable),
          row.is_public
        );

        exercices.push(exercice);
      });

      return exercices;
    } catch (e) {
      throw new Error("Erreur Database [ExerciceRepository getAll]\n" + e);
    }
  }

  async create(exercice: Exercice): Promise<Exercice> {
    try {
      const query = `
        INSERT INTO exercises (name, muscle_1_id, muscle_2_id, muscle_3_id, user_id, is_public)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `;

      const values = [exercice.name, exercice.muscle_1.id, exercice.muscle_2?.id ?? null, exercice.muscle_3?.id ?? null, exercice.user.id, exercice.is_public];

      const result = await pool.query(query, values);

      const created = await this.findById(result.rows[0].id);

      if (!created) {
        throw new Error("Exercice créé mais introuvable");
      }

      return created;
    } catch (e) {
      throw new Error("Erreur Database [ExerciceRepository create]\n" + e);
    }
  }

  async update(exercice: Exercice): Promise<Exercice> {
    try {
      const query = `UPDATE exercises SET name = $1, muscle_1_id = $2, muscle_2_id = $3, muscle_3_id = $4, user_id = $5, is_public = $6 WHERE id = $7 RETURNING id`;

      const values = [exercice.name, exercice.muscle_1.id, exercice.muscle_2?.id ?? null, exercice.muscle_3?.id ?? null, exercice.user.id, exercice.is_public, exercice.id];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error("Exercice introuvable");
      }

      const updated = await this.findById(result.rows[0].id);

      if (!updated) {
        throw new Error("Exercice modifié mais introuvable");
      }

      return updated;
    } catch (e) {
      throw new Error("Erreur Database [ExerciceRepository update]\n" + e);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM exercises WHERE id = $1 RETURNING id`;

      const result = await pool.query(query, [id]);

      return result.rows.length > 0;
    } catch (e) {
      throw new Error("Erreur Database [ExerciceRepository delete]\n" + e);
    }
  }
}
