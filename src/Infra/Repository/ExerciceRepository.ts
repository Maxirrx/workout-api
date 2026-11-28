import { Image } from "../../Domain/Entity/Image";
import { Exercice } from "../../Domain/Entity/Exercice";
import { Muscle } from "../../Domain/Entity/Muscle";
import { IUserRepository } from "../../Domain/Port/Out/Repository/IUserRepository";
import { IExerciceRepository } from "../../Domain/Port/Out/Repository/IExerciceRepository";
import { pool } from "../Config/db";
import { userRepository } from "./UserRepository";

export class ExerciceRepository implements IExerciceRepository {
  private readonly selectExercice = `SELECT e.*, m1.name AS muscle_1_name, m2.name AS muscle_2_name,
    m3.name AS muscle_3_name, i.url AS picture_url
    FROM exercises e
    JOIN muscles m1 ON m1.id = e.muscle_1_id
    LEFT JOIN muscles m2 ON m2.id = e.muscle_2_id
    LEFT JOIN muscles m3 ON m3.id = e.muscle_3_id
    LEFT JOIN images i ON i.id = e.picture_id`;

  constructor(private readonly users: Pick<IUserRepository, "findById"> = new userRepository()) {}

  private async makeExercice(row: Record<string, any>): Promise<Exercice> {
    const user = await this.users.findById(Number(row.user_id));
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    return new Exercice(
      Number(row.id),
      row.name,
      new Muscle(Number(row.muscle_1_id), row.muscle_1_name),
      row.muscle_2_id == null ? undefined : new Muscle(Number(row.muscle_2_id), row.muscle_2_name),
      row.muscle_3_id == null ? undefined : new Muscle(Number(row.muscle_3_id), row.muscle_3_name),
      user,
      row.is_public,
      row.picture_id == null ? null : new Image(Number(row.picture_id), row.picture_url)
    );
  }

  async findById(id: number): Promise<Exercice | undefined> {
    try {
      const { rows } = await pool.query(`${this.selectExercice} WHERE e.id = $1`, [id]);
      return rows[0] && await this.makeExercice(rows[0]);
    } catch (e) {
      throw new Error("Erreur Database [ExerciceRepository findById]\n" + e);
    }
  }

  async findAll(): Promise<Exercice[]> {
    try {
      const { rows } = await pool.query(this.selectExercice);
      return await Promise.all(rows.map((row) => this.makeExercice(row)));
    } catch (e) {
      throw new Error("Erreur Database [ExerciceRepository getAll]\n" + e);
    }
  }

  async create(exercice: Exercice): Promise<Exercice> {
    try {
      const query = `
        INSERT INTO exercises (name, muscle_1_id, muscle_2_id, muscle_3_id, user_id, is_public, picture_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `;

      const values = [exercice.name, exercice.muscle_1.id, exercice.muscle_2?.id ?? null, exercice.muscle_3?.id ?? null, exercice.user.id, exercice.is_public, exercice.picture?.id];

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
      const query = `UPDATE exercises SET name = $1, muscle_1_id = $2, muscle_2_id = $3, muscle_3_id = $4, user_id = $5, is_public = $6, picture_id = CASE WHEN $7 THEN $8 ELSE picture_id END WHERE id = $9 RETURNING id`;

      const values = [exercice.name, exercice.muscle_1.id, exercice.muscle_2?.id ?? null, exercice.muscle_3?.id ?? null, exercice.user.id, exercice.is_public, exercice.picture !== undefined, exercice.picture?.id, exercice.id];

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
