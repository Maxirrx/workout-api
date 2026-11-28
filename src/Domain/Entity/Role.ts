export class Role {
  id: number;
  name: string;
  app_id: string;

  constructor(id: number, name: string, app_id: string) {
    this.id = id;
    this.name = name;
    this.app_id = app_id;
  }
}

export function makeRoleFaker(role?: Partial<Role>): Role {
  return new Role(role?.id ?? 1, role?.name ?? "user", role?.app_id ?? "app");
}
