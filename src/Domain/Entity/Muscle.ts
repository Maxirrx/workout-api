export class Muscle {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export function makeMuscleFaker(muscle : Partial<Muscle>): Muscle {
  return new Muscle(muscle?.id ?? 1, muscle?.name ?? "Biceps");
}
