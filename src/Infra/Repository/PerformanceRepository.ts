import { Performance } from "../../Domain/Entity/Performance";
import { Image } from "../../Domain/Entity/Image";
import { PerformanceStatus } from "../../Domain/Entity/PerformanceStatus";
import { WorkoutSession } from "../../Domain/Entity/WorkoutSession";
import { WorkoutTemplate } from "../../Domain/Entity/WorkoutTemplate";
import { IExerciceRepository } from "../../Domain/Port/Out/Repository/IExerciceRepository";
import { IPerformanceRepository } from "../../Domain/Port/Out/Repository/IPerformanceRepository";
import { ApiError } from "../../Utils/ApiError";
import { pool } from "../Config/db";
import { userRepository } from "./UserRepository";

export class PerformanceRepository implements IPerformanceRepository {
  constructor(private readonly exerciceRepository: IExerciceRepository, private readonly users = new userRepository()) {}

  private readonly selectPerformance: string = `SELECT p.*, s.date_of_workout, s.is_end, t.id AS template_id,
              t.name AS template_name, t.is_public AS template_is_public,
              s.user_id AS session_user_id, t.user_id AS template_user_id, ps.name AS status_name,
              ARRAY(SELECT json_build_object('id', i.id::text, 'url', i.url)
                    FROM workout_session_images si JOIN images i ON i.id = si.image_id
                    WHERE si.workout_session_id = s.id ORDER BY i.id) AS pictures,
              ARRAY(SELECT exercise_id FROM workout_template_exercises
                    WHERE workout_template_id = t.id ORDER BY position) AS template_exercise_ids
       FROM performances p
       JOIN workout_sessions s ON s.id = p.workout_session_id
       JOIN workout_templates t ON t.id = s.workout_template_id
       LEFT JOIN performance_statuses ps ON ps.id = p.status_id`;

  private async makePerformance(row: Record<string, any>): Promise<Performance> {
    const exercice = await this.exerciceRepository.findById(row.exercise_id);
    if (!exercice) {
      throw new ApiError(404, "Exercice introuvable");
    }

    const templateExercices = await Promise.all((row.template_exercise_ids as string[]).map(async (exerciseId) => {
      const templateExercice = await this.exerciceRepository.findById(Number(exerciseId));
      if (!templateExercice) {
        throw new ApiError(404, "Exercice du modèle introuvable");
      }
      return templateExercice;
    }));

    const [sessionUser, templateUser] = await Promise.all([
      this.users.findById(Number(row.session_user_id)),
      this.users.findById(Number(row.template_user_id))
    ]);

    if (!sessionUser || !templateUser) {
      throw new ApiError(404, "Utilisateur introuvable");
    }

    const pictures = (row.pictures as { id: string; url: string }[]).map((picture) => new Image(Number(picture.id), picture.url));
    const status = row.status_id == null ? null : new PerformanceStatus(Number(row.status_id), row.status_name);
    const template = new WorkoutTemplate(Number(row.template_id), row.template_name, templateUser, templateExercices, row.template_is_public);
    const session = new WorkoutSession(Number(row.workout_session_id), sessionUser, template, row.date_of_workout, row.is_end, pictures);

    return new Performance(Number(row.id), exercice, row.weight === null ? undefined : Number(row.weight), row.rep ?? undefined,
      row.time_seconds ?? undefined, row.rest_seconds ?? undefined, session, status);
  }

  async findById(id: number): Promise<Performance | undefined> {
    const { rows } = await pool.query(`${this.selectPerformance} WHERE p.id = $1`, [id]);
    return rows[0] && this.makePerformance(rows[0]);
  }

  async findAll(): Promise<Performance[]> {
    const { rows } = await pool.query(`${this.selectPerformance} ORDER BY p.id`);
    return Promise.all(rows.map((row) => this.makePerformance(row)));
  }

  async create(performance: Performance): Promise<Performance> {
    const { rows } = await pool.query(
      `INSERT INTO performances (workout_session_id, exercise_id, weight, rep, time_seconds, rest_seconds, status_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [performance.workout_session.id, performance.exercice.id, performance.weight, performance.rep, performance.time, performance.rest, performance.status?.id]
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
       weight = $3, rep = $4, time_seconds = $5, rest_seconds = $6, status_id = CASE WHEN $7 THEN $8 ELSE status_id END
       WHERE id = $9 RETURNING id`,
      [performance.workout_session.id, performance.exercice.id, performance.weight, performance.rep, performance.time, performance.rest, performance.status !== undefined, performance.status?.id, performance.id]
    );

    return rows[0] && this.findById(Number(rows[0].id));
  }

  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query("DELETE FROM performances WHERE id = $1", [id]);
    return rowCount === 1;
  }
}
