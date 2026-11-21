import { inject, injectable } from "tsyringe";
import { User } from "../Entity/User";
import { IUserRepository } from "../Port/Out/Repository/IUserRepository";

@injectable()
export class DUserService {
  
  constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}

 async canCreateUser(user: User): Promise<void> {
    user.checkPassword();

    if (await this.userRepository.findByEmail(user.email)) {
      throw new Error("Il existe déjà un compte qui utilise cette adresse email");
    }

    if (await this.userRepository.findByName(user.name)) {
      throw new Error("Il existe déjà un compte qui utilise ce nom");
    }
  }
}
