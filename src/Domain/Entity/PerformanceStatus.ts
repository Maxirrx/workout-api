export class PerformanceStatus {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export function makePerformanceStatusFaker(status?: Partial<PerformanceStatus>): PerformanceStatus {
  return new PerformanceStatus(status?.id ?? 1, status?.name ?? "echec");
}
