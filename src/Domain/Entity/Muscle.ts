import { randomInt } from "crypto";

export class Muscle {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export function makeMuscleFaker(id: number): Muscle {
  return new Muscle(id, "Biceps");
}
