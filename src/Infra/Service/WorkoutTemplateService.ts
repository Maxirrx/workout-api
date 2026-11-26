import { inject, injectable } from "tsyringe";
import { WorkoutTemplate } from "../../Domain/Entity/WorkoutTemplate";
import { IWorkoutTemplateRepository } from "../../Domain/Port/Out/Repository/IWorkoutTemplateRepository";
import { IWorkoutTemplateService } from "../../Domain/Port/Out/Service/IWorkoutTemplateService";

@injectable()
export class WorkoutTemplateService implements IWorkoutTemplateService {
  constructor(
    @inject("IWorkoutTemplateRepository")
    private readonly IWorkoutTemplateRepository: IWorkoutTemplateRepository
  ) {}

  async create(workoutTemplate: WorkoutTemplate): Promise<WorkoutTemplate> {
    return this.IWorkoutTemplateRepository.create(workoutTemplate);
  }

  async findById(id: number): Promise<WorkoutTemplate | undefined> {
    return this.IWorkoutTemplateRepository.findById(id);
  }

  async findAll(): Promise<WorkoutTemplate[] | undefined> {
    return this.IWorkoutTemplateRepository.findAll();
  }

  async update(workoutTemplate: WorkoutTemplate): Promise<WorkoutTemplate> {
    return this.IWorkoutTemplateRepository.update(workoutTemplate);
  }

  async delete(id: number): Promise<boolean> {
    return this.IWorkoutTemplateRepository.delete(id);
  }
}
