import { User } from "../Entity/User";
import { IUserService } from "../Port/Out/Service/IUserService";

export class UserService{
    IUserService: IUserService

    constructor(IUserService : IUserService){
        this.IUserService = IUserService
    }

    canCreateUser(user : User): void{
        if(this.IUserService.isExistEmail(user.email)){
            throw new Error("Il existe déjà un compte qui utilise cette adresse email")
        }
        else if(this.IUserService.isExistName(user.name)){
            throw new Error("Il existe déjà un compte qui utilise ce nom")
        }
    }
}