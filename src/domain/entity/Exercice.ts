export class Exercice {
  name: string;
  muscle_1_id: number;
  muscle_2_id?: number;
  muscle_3_id?: number;
  user_id: number;
  is_public: boolean;

  constructor(name : string, muscle_1_id : number, muscle_2_id : number, muscle_3_id : number, user_id : number, is_public : boolean){
    this.name = name
    this.muscle_1_id = muscle_1_id
    this.muscle_2_id = muscle_2_id
    this.muscle_3_id = muscle_3_id
    this.user_id = user_id
    this.is_public = is_public
    
    this.validate()
  }

  validate(): void{
    this.checkIndividualMuscle();
  }

  checkIndividualMuscle(): void{
    if((this.muscle_1_id === this.muscle_2_id) || (this.muscle_3_id === this.muscle_2_id) || (this.muscle_1_id === this.muscle_3_id)){
      throw new Error("Vous ne pouvez pas mettre le même muscle plusieur fois sur un exercice")
    }
  }

}
