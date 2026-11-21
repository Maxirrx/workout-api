import { inject, injectable } from "tsyringe";
import { User } from "../../Domain/Entity/User";
import { IUserService } from "../../Domain/Port/Out/Service/IUserService";
import { DUserService } from "../../Domain/Service/DUserService";
import { IUserRepository } from "../Repository/UserRepository";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("IUserRepository")
    private readonly IUserRepository: IUserRepository,
    private readonly dUserService: DUserService
  ) {}

  isExistEmail(email: string): boolean {
    const user = this.IUserRepository.findByEmail(email);
    if (user === undefined) {
      return false;
    }
    return true;
  }

  isExistName(name: string): boolean {
    const user = this.IUserRepository.findByName(name);
    if (user === undefined) {
      return false;
    }
    return true;
  }

  async create(user: User): Promise<User> {
    await this.dUserService.canCreateUser(user);
    return this.IUserRepository.create(user);
  }

  async findByName(name: string): Promise<User | undefined> {
    return this.IUserRepository.findByName(name);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.IUserRepository.findByEmail(email);
  }

  async findByID(id: string): Promise<User | undefined> {
    return this.IUserRepository.findById(id);
  }
}
