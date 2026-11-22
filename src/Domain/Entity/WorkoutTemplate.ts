import { Exercice, makeExerciceFaker } from "./Exercice";
import { makeUserFaker, User } from "./User";

export class WorkoutTemplate {
  id: number;
  name: string;
  user: User;
  exercices: Exercice[];
  is_public: boolean;

  constructor(id: number, name: string, user: User, exercices: Exercice[], is_public: boolean) {
    this.id = id;
    this.name = name;
    this.user = user;
    this.exercices = exercices
    this.is_public = is_public;
  }
}

export function makeWorkoutTemplateFaker(): WorkoutTemplate {
  const user = makeUserFaker();

  return new WorkoutTemplate(1, "PUSH", user, [makeExerciceFaker()], false);
}
