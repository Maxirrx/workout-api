import { inject, injectable } from "tsyringe";
import { User } from "../../Domain/Entity/User";
import { IUserService } from "../../Domain/Port/Out/Service/IUserService";
import { DUserService } from "../../Domain/Service/DUserService";
import { IUserRepository } from "../../Domain/Port/Out/Repository/IUserRepository";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("IUserRepository")
    private readonly IUserRepository: IUserRepository,
    private readonly dUserService: DUserService
  ) {}

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

  async findByID(id: number): Promise<User | undefined> {
    return this.IUserRepository.findById(id);
  }

  async findAll(): Promise<User[] | undefined> {
    return this.IUserRepository.findAll();
  }

  async update(user: User): Promise<User> {
    return this.IUserRepository.update(user);
  }

  async delete(id: number): Promise<boolean> {
    return this.IUserRepository.delete(id);
  }

  async disable(id: number): Promise<boolean> {
    return this.IUserRepository.disable(id);
  }

  async enable(id: number): Promise<boolean> {
    return this.IUserRepository.enable(id);
  }
}
