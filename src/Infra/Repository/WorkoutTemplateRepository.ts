import { WorkoutTemplate } from "../../Domain/Entity/WorkoutTemplate";
import { IUserRepository } from "../../Domain/Port/Out/Repository/IUserRepository";
import { IExerciceRepository } from "../../Domain/Port/Out/Repository/IExerciceRepository";
import { IWorkoutTemplateRepository } from "../../Domain/Port/Out/Repository/IWorkoutTemplateRepository";
import { ApiError } from "../../Utils/ApiError";
import { pool } from "../Config/db";

export class WorkoutTemplateRepository implements IWorkoutTemplateRepository {
  private readonly selectWorkoutTemplate = `SELECT t.*,
    ARRAY(SELECT exercise_id FROM workout_template_exercises WHERE workout_template_id = t.id ORDER BY position) AS exercise_ids
    FROM workout_templates t`;

  constructor(
    private readonly userRepository: Pick<IUserRepository, "findById">,
    private readonly exerciceRepository: IExerciceRepository
  ) {}

  async create(template: WorkoutTemplate): Promise<WorkoutTemplate> {
    const result = await pool.query(
      `INSERT INTO workout_templates (name, user_id, is_public)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [template.name, template.user.id, template.is_public]
    );

    const id = Number(result.rows[0].id);

    await pool.query(
      `INSERT INTO workout_template_exercises (workout_template_id, exercise_id, position)
       SELECT $1, exercise_id, position
       FROM unnest($2::bigint[]) WITH ORDINALITY AS exercices(exercise_id, position)`,
      [id, template.exercices.map((exercice) => exercice.id)]
    );

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM workout_templates WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      throw new ApiError(404, "WorkoutTemplate introuvable");
    }

    return true;
  }

  async update(template: WorkoutTemplate): Promise<WorkoutTemplate> {
    const result = await pool.query(
      `UPDATE workout_templates
       SET name = $1, user_id = $2, is_public = $3
       WHERE id = $4
       RETURNING id`,
      [template.name, template.user.id, template.is_public, template.id]
    );

    if (result.rowCount === 0) {
      throw new ApiError(404, "WorkoutTemplate introuvable");
    }

    await pool.query(
      `DELETE FROM workout_template_exercises
       WHERE workout_template_id = $1`,
      [template.id]
    );

    await pool.query(
      `INSERT INTO workout_template_exercises (workout_template_id, exercise_id, position)
       SELECT $1, exercise_id, position
       FROM unnest($2::bigint[]) WITH ORDINALITY AS exercices(exercise_id, position)`,
      [template.id, template.exercices.map((exercice) => exercice.id)]
    );

    return this.findById(template.id);
  }

  private async makeWorkoutTemplate(row: Record<string, any>): Promise<WorkoutTemplate> {
    const user = await this.userRepository.findById(Number(row.user_id));

    if (!user) {
      throw new ApiError(404, "Utilisateur introuvable");
    }

    const exercices = await Promise.all(
      (row.exercise_ids as string[]).map(async (id) => {
        const exercice = await this.exerciceRepository.findById(Number(id));

        if (!exercice) {
          throw new ApiError(404, "Exercice introuvable");
        }

        return exercice;
      })
    );

    return new WorkoutTemplate(Number(row.id), row.name, user, exercices, row.is_public);
  }

  async findById(id: number): Promise<WorkoutTemplate> {
    const { rows } = await pool.query(`${this.selectWorkoutTemplate} WHERE t.id = $1`, [id]);

    if (!rows[0]) {
      throw new ApiError(404, "WorkoutTemplate introuvable");
    }

    return this.makeWorkoutTemplate(rows[0]);
  }

  async findAll(): Promise<WorkoutTemplate[]> {
    const { rows } = await pool.query(`${this.selectWorkoutTemplate} ORDER BY t.id`);
    return Promise.all(rows.map((row) => this.makeWorkoutTemplate(row)));
  }
}
