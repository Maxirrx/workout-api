import { Performance } from "../../../Entity/Performance";

export abstract class IPerformanceRepository {
  abstract findById(id: number): Promise<Performance | undefined>;
  abstract findAll(): Promise<Performance[]>;
  abstract create(performance: Performance): Promise<Performance>;
  abstract update(performance: Performance): Promise<Performance | undefined>;
  abstract delete(id: number): Promise<boolean>;
}
