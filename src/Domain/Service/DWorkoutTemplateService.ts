import { checkSwearWord } from "../../Utils/checkSwearWord";
import { WorkoutTemplate } from "../Entity/WorkoutTemplate";

export class WorkoutTemplateService{

    canUpdateWorkoutTemplate(workoutTemplate :WorkoutTemplate): void{
        if(workoutTemplate.is_public){
            checkSwearWord(workoutTemplate.name)
        }
    }

    canCreateWorkoutTemplate(workoutTemplate : WorkoutTemplate): void{
        if(workoutTemplate.is_public){
            checkSwearWord(workoutTemplate.name)
        }
    }
}