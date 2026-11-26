import { ApiError } from "../../Utils/ApiError";
import { makeUserFaker, User } from "./User";
import { makeWorkoutTemplateFaker, WorkoutTemplate } from "./WorkoutTemplate";

export class WorkoutSession {
  id: number;
  user: User;
  workout_template: WorkoutTemplate;
  date_of_workout: Date;
  is_end: boolean;

  constructor(id: number, user: User, workout_template: WorkoutTemplate, date_of_workout: Date, is_end: boolean) {
    this.id = id;
    this.user = user;
    this.workout_template = workout_template;
    this.date_of_workout = date_of_workout;
    this.is_end = is_end;

    this.validate();
  }

  validate(): void {
    this.checkDateOfWorkoutForEnd();
  }

  checkDateOfWorkoutForEnd(): void {
    if (this.is_end && this.date_of_workout.getTime() > Date.now()) {
      throw new ApiError(409, `Vous ne pouvez pas terminer une séance planifiée pour le ${this.date_of_workout.toString()}`, "WORKOUT_NOT_YET_STARTED");
    }
  }
}

export function makeWorkoutSessionFaker(workoutSession : Partial<WorkoutSession>){
  const user = makeUserFaker()
  const workoutTemplate = makeWorkoutTemplateFaker()

  return new WorkoutSession(workoutSession.id ?? 1, workoutSession.user ?? user, workoutSession.workout_template ?? workoutTemplate, workoutSession.date_of_workout ?? new Date(2005, 3, 23), workoutSession.is_end ?? false)
}
