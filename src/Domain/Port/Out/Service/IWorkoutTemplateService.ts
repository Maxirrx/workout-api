
import { WorkoutTemplate } from "../../../Entity/WorkoutTemplate";

export interface IWorkoutTemplateService {
  create(workoutTemplate: WorkoutTemplate): Promise<WorkoutTemplate>;
  findById(id: number): Promise<WorkoutTemplate | undefined>;
  findAll(): Promise<WorkoutTemplate[] | undefined>;
  update(workoutTemplate: WorkoutTemplate): Promise<WorkoutTemplate>;
  delete(id: number): Promise<boolean>;
}
