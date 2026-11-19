import { Exercice } from "./Exercice"

export class Performance {
    id :  number
    exercice : Exercice
    weight : number | undefined
    rep : number | undefined
    time : number | undefined
    rest: number | undefined
    //status: 

    constructor(id :  number, exercice: Exercice, weight : number | undefined, rep : number | undefined, time : number | undefined, rest: number | undefined){
        this.id = id
        this.exercice = exercice
        this.weight = weight
        this.rep = rep
        this.time = time
        this.rest = rest

        this.validate()
    }

    validate(): void {
        this.checkTime()
    }

    checkTime(): void{
        if(this.time != undefined && (this.time % 1 != 0) || this.rest != undefined && (this.rest % 1 != 0)){
            throw new Error("Les durées doivent être écritent en secondes entières")
        }
    }


  

}
