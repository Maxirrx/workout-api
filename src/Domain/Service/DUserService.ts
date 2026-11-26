import { inject, injectable } from "tsyringe";
import { User } from "../Entity/User";
import { IUserRepository } from "../Port/Out/Repository/IUserRepository";
import { ApiError } from "../../Utils/ApiError";

@injectable()
export class DUserService {
  constructor(@inject("IUserRepository") private readonly userRepository: IUserRepository) {}

  async canCreateUser(user: User): Promise<void> {
    user.checkPassword();

    if (await this.userRepository.findByEmail(user.email)) {
      throw new ApiError(409, "Il existe déjà un compte qui utilise cette adresse email", "EMAIL_ALREADY_EXISTS");
    }

    if (await this.userRepository.findByName(user.name)) {
      throw new ApiError(409, "Il existe déjà un compte qui utilise ce nom", "USERNAME_ALREADY_EXISTS");
    }
  }
}
