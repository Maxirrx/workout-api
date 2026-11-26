import { ApiError } from "../../Utils/ApiError";
import { makeMuscleFaker, Muscle } from "./Muscle";
import { makeUserFaker, User } from "./User";

export class Exercice {
  id: number;
  name: string;
  muscle_1: Muscle;
  muscle_2: Muscle | undefined;
  muscle_3: Muscle | undefined;
  user: User;
  is_public: boolean;

  constructor(id: number, name: string, muscle_1: Muscle, muscle_2: Muscle | undefined, muscle_3: Muscle | undefined, user: User, is_public: boolean) {
    this.id = id;
    this.name = name;
    this.muscle_1 = muscle_1;
    this.muscle_2 = muscle_2;
    this.muscle_3 = muscle_3;
    this.user = user;
    this.is_public = is_public;

    this.validate();
  }

  validate(): void {
    this.checkIndividualMuscle();
  }

  checkIndividualMuscle(): void {
    if (
      this.muscle_1.id === this.muscle_2?.id ||
      (this.muscle_3?.id != undefined && this.muscle_2?.id != undefined && this.muscle_3?.id === this.muscle_2?.id) ||
      this.muscle_1.id === this.muscle_3?.id
    ) {
      throw new ApiError(409, "Vous ne pouvez pas mettre le même muscle plusieurs fois sur un exercice", "DUPLICATE_EXERCISE_MUSCLE");
    }
  }
}

export function makeExerciceFaker(exercice? : Partial<Exercice>): Exercice {
  const muscle1 = makeMuscleFaker({id: 1});
  const muscle2 = makeMuscleFaker({id: 2});
  const muscle3 = makeMuscleFaker({id: 3});

  const user = makeUserFaker();
  return new Exercice(exercice?.id ?? 1, exercice?.name ?? "Curl Marteau", exercice?.muscle_1 ?? muscle1, exercice?.muscle_2 ?? muscle2, exercice?.muscle_3 ?? muscle3, exercice?.user ?? user, exercice?.is_public ?? false);
}
