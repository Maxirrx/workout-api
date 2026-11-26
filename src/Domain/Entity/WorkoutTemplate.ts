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

export function makeWorkoutTemplateFaker(workoutTemplate? : Partial<WorkoutTemplate>): WorkoutTemplate {
  const user = makeUserFaker();

  return new WorkoutTemplate(workoutTemplate?.id ?? 1, workoutTemplate?.name ?? "PUSH", workoutTemplate?.user ?? user, workoutTemplate?.exercices ?? [makeExerciceFaker()], workoutTemplate?.is_public ?? false);
}
