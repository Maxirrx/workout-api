import { User } from "../../../Entity/User";

export abstract class IUserRepository {
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract findByName(name: string): Promise<User | undefined>;
  abstract findById(id: number): Promise<User | undefined>;
  abstract findAll(): Promise<User[] | undefined>;
  abstract create(user: User): Promise<User>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: number): Promise<boolean>;
  abstract disable(id: number): Promise<boolean>;
  abstract enable(id: number): Promise<boolean>;
}