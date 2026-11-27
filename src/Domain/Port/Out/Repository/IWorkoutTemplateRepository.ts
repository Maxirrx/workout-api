import { WorkoutTemplate } from "../../../Entity/WorkoutTemplate";

export abstract class IWorkoutTemplateRepository {
  abstract create(template: WorkoutTemplate): Promise<WorkoutTemplate>;
  abstract delete(id: number): Promise<boolean>;
  abstract update(template: WorkoutTemplate): Promise<WorkoutTemplate>;
  abstract findById(id: number): Promise<WorkoutTemplate>;
  abstract findAll(): Promise<WorkoutTemplate[]>;
}
