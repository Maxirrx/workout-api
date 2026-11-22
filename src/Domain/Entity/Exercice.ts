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
      throw new Error("Vous ne pouvez pas mettre le même muscle plusieur fois sur un exercice");
    }
  }
}

export function makeExerciceFaker(): Exercice {
  const muscle1 = makeMuscleFaker(1);
  const muscle2 = makeMuscleFaker(2);
  const muscle3 = makeMuscleFaker(3);

  const user = makeUserFaker();
  return new Exercice(1, "Curl Marteau", muscle1, muscle2, muscle3, user, false);
}
