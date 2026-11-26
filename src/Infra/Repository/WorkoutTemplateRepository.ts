import { Pool } from "pg";
import { WorkoutTemplate } from "../../Domain/Entity/WorkoutTemplate";
import { IUserRepository } from "../../Domain/Port/Out/Repository/IUserRepository";
import { IExerciceRepository } from "../../Domain/Port/Out/Repository/IExerciceRepository";
import { IWorkoutTemplateRepository } from "../../Domain/Port/Out/Repository/IWorkoutTemplateRepository";
import { ApiError } from "../../Utils/ApiError";
import { pool } from "../Config/db";

export class WorkoutTemplateRepository implements IWorkoutTemplateRepository {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly exerciceRepository: IExerciceRepository
  ) {}

  async create(template: WorkoutTemplate): Promise<WorkoutTemplate> {
    const result = await pool.query(
      `INSERT INTO workout_template (name, user_id, is_public)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [template.name, template.user.id, template.is_public]
    );

    const id = result.rows[0].id;

    for (const exercice of template.exercices) {
      await pool.query(
        `INSERT INTO workout_template_exercices
         (workout_template_id, exercice_id)
         VALUES ($1, $2)`,
        [id, exercice.id]
      );
    }

    return new WorkoutTemplate(id, template.name, template.user, template.exercices, template.is_public);
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM workout_template WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      throw new ApiError(404, "WorkoutTemplate introuvable");
    }

    return true;
  }

  async update(template: WorkoutTemplate): Promise<WorkoutTemplate> {
    const result = await pool.query(
      `UPDATE workout_template
       SET name = $1, user_id = $2, is_public = $3
       WHERE id = $4
       RETURNING id`,
      [template.name, template.user.id, template.is_public, template.id]
    );

    if (result.rowCount === 0) {
      throw new ApiError(404, "WorkoutTemplate introuvable");
    }

    await pool.query(
      `DELETE FROM workout_template_exercices
       WHERE workout_template_id = $1`,
      [template.id]
    );

    for (const exercice of template.exercices) {
      await pool.query(
        `INSERT INTO workout_template_exercices
         (workout_template_id, exercice_id)
         VALUES ($1, $2)`,
        [template.id, exercice.id]
      );
    }

    return template;
  }

  async findById(id: number): Promise<WorkoutTemplate> {
    const result = await pool.query(`SELECT * FROM workout_template WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      throw new ApiError(404, "WorkoutTemplate introuvable");
    }

    const row = result.rows[0];

    const user = await this.userRepository.findById(row.user_id);

    if (!user) {
      throw new ApiError(404, "Utilisateur introuvable");
    }

    const exerciceResult = await pool.query(
      `SELECT exercice_id
       FROM workout_template_exercices
       WHERE workout_template_id = $1`,
      [id]
    );

    const exercices = await Promise.all(
      exerciceResult.rows.map(async (item) => {
        const exercice = await this.exerciceRepository.findById(item.exercice_id);

        if (!exercice) {
          throw new ApiError(404, "Exercice introuvable");
        }

        return exercice;
      })
    );

    return new WorkoutTemplate(row.id, row.name, user, exercices, row.is_public);
  }

  async findAll(): Promise<WorkoutTemplate[]> {
    const result = await pool.query(`SELECT id FROM workout_template ORDER BY id`);

    return Promise.all(result.rows.map((row) => this.findById(row.id)));
  }
}
