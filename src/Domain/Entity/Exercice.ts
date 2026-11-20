import { Muscle } from "./Muscle";
import { User } from "./User";

export class Exercice {
  name: string;
  muscle_1: Muscle;
  muscle_2: Muscle | undefined;
  muscle_3: Muscle | undefined;
  user: User;
  is_public: boolean;

  constructor(name : string, muscle_1 : Muscle, muscle_2 : Muscle | undefined, muscle_3 : Muscle | undefined, user : User, is_public : boolean){
    this.name = name
    this.muscle_1 = muscle_1
    this.muscle_2 = muscle_2
    this.muscle_3 = muscle_3
    this.user = user
    this.is_public = is_public
    
    this.validate()
  }

  validate(): void{
    this.checkIndividualMuscle();
  }

  checkIndividualMuscle(): void{
    if((this.muscle_1.id === this.muscle_2?.id) || (this.muscle_3?.id != undefined && this.muscle_2?.id != undefined && this.muscle_3?.id === this.muscle_2?.id) || (this.muscle_1.id === this.muscle_3?.id)){
      throw new Error("Vous ne pouvez pas mettre le même muscle plusieur fois sur un exercice")
    }
  }

}
