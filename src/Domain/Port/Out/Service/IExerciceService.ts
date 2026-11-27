import { Exercice } from "../../../Entity/Exercice";

export abstract class IExerciceService {
  abstract findById(id: number): Promise<Exercice | undefined>;
  abstract findAll(): Promise<Exercice[]>;
  abstract create(exercice: Exercice): Promise<Exercice>;
  abstract update(exercice: Exercice): Promise<Exercice | undefined>;
  abstract delete(id: number): Promise<boolean>;
}