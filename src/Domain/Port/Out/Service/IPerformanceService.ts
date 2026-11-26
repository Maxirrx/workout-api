import { Performance } from "../../../Entity/Performance";

export interface IPerformanceService {
  findById(id: number): Promise<Performance | undefined>;
  findAll(): Promise<Performance[]>;
  create(performance: Performance): Promise<Performance>;
  update(performance: Performance): Promise<Performance | undefined>;
  delete(id: number): Promise<boolean>;
}
