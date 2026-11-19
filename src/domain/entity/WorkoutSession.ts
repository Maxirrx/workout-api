import { User } from "./User";
import { WorkoutTemplate } from "./WorkoutTemplate";

export class WorkoutSession {
  user: User;
  workout_template: WorkoutTemplate;
  date_of_workout: Date;
  is_end : boolean

  constructor(user: User, workout_template: WorkoutTemplate, date_of_workout: Date, is_end : boolean){
    this.user = user
    this.workout_template = workout_template
    this.date_of_workout = date_of_workout
    this.is_end = is_end

    this.validate()
  }

  validate(): void{
    this.checkDateOfWorkoutForEnd()
  }

  checkDateOfWorkoutForEnd(): void{
    if(this.is_end && this.date_of_workout.getTime() > Date.now()){
      throw new Error(`Vous ne pouvez pas terminer une séance qui est planifié pour le ${this.date_of_workout.toString()}`)
    }
  }
}
