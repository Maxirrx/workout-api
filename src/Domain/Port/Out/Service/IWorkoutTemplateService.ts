
import { WorkoutTemplate } from "../../../Entity/WorkoutTemplate";

export abstract class IWorkoutTemplateService {
  abstract create(workoutTemplate: WorkoutTemplate): Promise<WorkoutTemplate>;
  abstract findById(id: number): Promise<WorkoutTemplate | undefined>;
  abstract findAll(): Promise<WorkoutTemplate[] | undefined>;
  abstract update(workoutTemplate: WorkoutTemplate): Promise<WorkoutTemplate>;
  abstract delete(id: number): Promise<boolean>;
}
