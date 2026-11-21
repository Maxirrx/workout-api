import { User } from "../../../Entity/User";

export abstract class IUserRepository {
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract findByName(name: string): Promise<User | undefined>;
  abstract findById(name: string): Promise<User | undefined>;
  abstract findAll(): Promise<User[] | undefined>;
  abstract create(user: User): Promise<User>;
}