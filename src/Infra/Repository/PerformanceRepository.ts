import { Performance } from "../../Domain/Entity/Performance";
import { User } from "../../Domain/Entity/User";
import { WorkoutSession } from "../../Domain/Entity/WorkoutSession";
import { WorkoutTemplate } from "../../Domain/Entity/WorkoutTemplate";
import { IExerciceRepository } from "../../Domain/Port/Out/Repository/IExerciceRepository";
import { IPerformanceRepository } from "../../Domain/Port/Out/Repository/IPerformanceRepository";
import { ApiError } from "../../Utils/ApiError";
import { pool } from "../Config/db";

export class PerformanceRepository implements IPerformanceRepository {
  constructor(private readonly exerciceRepository: IExerciceRepository) {}

  async findById(id: number): Promise<Performance | undefined> {
    const { rows } = await pool.query(
      `SELECT p.*, s.date_of_workout, s.is_end, t.id AS template_id,
              t.name AS template_name, t.is_public AS template_is_public,
              row_to_json(su) AS session_user, row_to_json(tu) AS template_user,
              ARRAY(SELECT exercise_id FROM workout_template_exercises
                    WHERE workout_template_id = t.id ORDER BY exercise_id) AS template_exercise_ids
       FROM performances p
       JOIN workout_sessions s ON s.id = p.workout_session_id
       JOIN workout_templates t ON t.id = s.workout_template_id
       JOIN users su ON su.id = s.user_id
       JOIN users tu ON tu.id = t.user_id
       WHERE p.id = $1`,
      [id]
    );

    const row = rows[0];
    if (!row) {
      return undefined;
    }

    const exercice = await this.exerciceRepository.findById(row.exercise_id);
    if (!exercice) {
      throw new ApiError(404, "Exercice introuvable");
    }

    const templateExercices = await Promise.all((row.template_exercise_ids as string[]).map(async (exerciseId) => {
      const templateExercice = await this.exerciceRepository.findById(exerciseId);
      if (!templateExercice) {
        throw new ApiError(404, "Exercice du modèle introuvable");
      }
      return templateExercice;
    }));

    const su = row.session_user;
    const tu = row.template_user;
    const sessionUser = new User(su.id, su.name, su.email, su.password, su.is_public, su.is_enable);
    const templateUser = new User(tu.id, tu.name, tu.email, tu.password, tu.is_public, tu.is_enable);
    const template = new WorkoutTemplate(Number(row.template_id), row.template_name, templateUser, templateExercices, row.template_is_public);
    const session = new WorkoutSession(Number(row.workout_session_id), sessionUser, template, row.date_of_workout, row.is_end);

    return new Performance(Number(row.id), exercice, row.weight === null ? undefined : Number(row.weight), row.rep ?? undefined,
      row.time_seconds ?? undefined, row.rest_seconds ?? undefined, session);
  }

  async findAll(): Promise<Performance[]> {
    const { rows } = await pool.query("SELECT id FROM performances ORDER BY id");
    const performances = await Promise.all(rows.map((row) => this.findById(Number(row.id))));
    return performances.filter((performance): performance is Performance => performance !== undefined);
  }

  async create(performance: Performance): Promise<Performance> {
    const { rows } = await pool.query(
      `INSERT INTO performances (workout_session_id, exercise_id, weight, rep, time_seconds, rest_seconds)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [performance.workout_session.id, performance.exercice.id, performance.weight, performance.rep, performance.time, performance.rest]
    );

    const created = await this.findById(Number(rows[0].id));
    if (!created) {
      throw new ApiError(404, "Performance créée mais introuvable");
    }
    return created;
  }

  async update(performance: Performance): Promise<Performance | undefined> {
    const { rows } = await pool.query(
      `UPDATE performances SET workout_session_id = $1, exercise_id = $2,
       weight = $3, rep = $4, time_seconds = $5, rest_seconds = $6
       WHERE id = $7 RETURNING id`,
      [performance.workout_session.id, performance.exercice.id, performance.weight, performance.rep, performance.time, performance.rest, performance.id]
    );

    return rows[0] && this.findById(Number(rows[0].id));
  }

  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query("DELETE FROM performances WHERE id = $1", [id]);
    return rowCount === 1;
  }
}
