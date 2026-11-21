import { checkSwearWord } from "../../Utils/checkSwearWord";
import { Exercice } from "../Entity/Exercice";

export class ExerciceService {
  canUpdateExercice(exercice: Exercice): void {
    if (exercice.is_public) {
      checkSwearWord(exercice.name);
    }
  }

  canCreateExercice(exercice: Exercice): void {
    if (exercice.is_public) {
      checkSwearWord(exercice.name);
    }
  }
}
