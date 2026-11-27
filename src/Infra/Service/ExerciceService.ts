
import { inject, injectable } from "tsyringe";
import { Exercice } from "../../Domain/Entity/Exercice";
import { IExerciceRepository } from "../../Domain/Port/Out/Repository/IExerciceRepository";
import { IExerciceService } from "../../Domain/Port/Out/Service/IExerciceService";

@injectable()
export class ExerciceService implements IExerciceService {
  constructor(
    @inject("IExerciceRepository")
    private readonly IExerciceRepository: IExerciceRepository
  ) {}

  async create(exercice: Exercice): Promise<Exercice> {
    return this.IExerciceRepository.create(exercice);
  }

  async findById(id: number): Promise<Exercice | undefined> {
    return this.IExerciceRepository.findById(id);
  }

  async findAll(): Promise<Exercice[]> {
    return this.IExerciceRepository.findAll();
  }

  async update(exercice: Exercice): Promise<Exercice> {
    return this.IExerciceRepository.update(exercice);
  }

  async delete(id: number): Promise<boolean> {
    return this.IExerciceRepository.delete(id);
  }
}
