import { WorkoutTemplate } from "../../../Entity/WorkoutTemplate";

export interface IWorkoutTemplateRepository {
  create(template: WorkoutTemplate): Promise<WorkoutTemplate>;
  delete(id: number): Promise<boolean>;
  update(template: WorkoutTemplate): Promise<WorkoutTemplate>;
  findById(id: number): Promise<WorkoutTemplate>;
  findAll(): Promise<WorkoutTemplate[]>;
}
