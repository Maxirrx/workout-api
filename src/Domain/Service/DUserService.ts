import { User } from "../Entity/User";
import { IUserService } from "../Port/Out/Service/IUserService";

export class DUserService{

    constructor(
        private readonly IUserService : IUserService)
    {}

    async canCreateUser(user : User): Promise<void>{
        user.checkPassword()
        if(await this.IUserService.isExistEmail(user.email)){
            throw new Error("Il existe déjà un compte qui utilise cette adresse email")
        }
        else if(await this.IUserService.isExistName(user.name)){
            throw new Error("Il existe déjà un compte qui utilise ce nom")
        }
    }
}