import { User } from "../../../Entity/User";

export abstract class IUserService {
  abstract create(user: User): Promise<User> 
  abstract findByName(name: string): Promise<User | undefined>
  abstract findByEmail(email: string): Promise<User | undefined> 
  abstract findByID(id: number): Promise<User | undefined>
  abstract findAll(): Promise<User[] | undefined> 
  abstract update(user: User): Promise<User> 
  abstract delete(id: number): Promise<boolean> 
  abstract disable(id: number): Promise<boolean> 
  abstract enable(id: number): Promise<boolean> 
}
