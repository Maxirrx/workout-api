import { Exercice } from "../../../Entity/Exercice";

export abstract class IExerciceRepository {
  abstract findById(id: string): Promise<Exercice | undefined>;
  abstract findAll(): Promise<Exercice[] | undefined>;
  abstract create(exercice: Exercice): Promise<Exercice>;
  abstract update(exercice: Exercice): Promise<Exercice>;
  abstract delete(id: string): Promise<boolean>;
}
