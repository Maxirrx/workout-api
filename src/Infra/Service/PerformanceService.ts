import { Performance } from "../../Domain/Entity/Performance";
import { IPerformanceRepository } from "../../Domain/Port/Out/Repository/IPerformanceRepository";
import { IPerformanceService } from "../../Domain/Port/Out/Service/IPerformanceService";

export class PerformanceService implements IPerformanceService {
  constructor(private readonly performanceRepository: IPerformanceRepository) {}

  findById(id: number): Promise<Performance | undefined> {
    return this.performanceRepository.findById(id);
  }

  findAll(): Promise<Performance[]> {
    return this.performanceRepository.findAll();
  }

  create(performance: Performance): Promise<Performance> {
    return this.performanceRepository.create(performance);
  }

  update(performance: Performance): Promise<Performance | undefined> {
    return this.performanceRepository.update(performance);
  }

  delete(id: number): Promise<boolean> {
    return this.performanceRepository.delete(id);
  }
}
