import { ApiError } from "../../Utils/ApiError";
import { Exercice, makeExerciceFaker } from "./Exercice";

export class Performance {
  id: number;
  exercice: Exercice;
  weight: number | undefined;
  rep: number | undefined;
  time: number | undefined;
  rest: number | undefined;
  //status:

  constructor(id: number, exercice: Exercice, weight: number | undefined, rep: number | undefined, time: number | undefined, rest: number | undefined) {
    this.id = id;
    this.exercice = exercice;
    this.weight = weight;
    this.rep = rep;
    this.time = time;
    this.rest = rest;

    this.validate();
  }

  validate(): void {
    this.checkTime();
  }

  checkTime(): void {
    if ((this.time != undefined && this.time % 1 != 0) || (this.rest != undefined && this.rest % 1 != 0)) {
      throw new ApiError(400, "Les durées doivent être écrites en secondes entières", "INVALID_DURATION");
    }
  }

}

export function makePerformanceFaker(performance? : Partial<Performance>){
  const exercice = makeExerciceFaker()

  return new Performance(performance?.id ?? 1, performance?.exercice ?? exercice, performance?.weight ?? 100, performance?.rep ?? 12, performance?.time ?? undefined, performance?.rest ?? undefined)
}
