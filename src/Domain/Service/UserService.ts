import { User } from "../Entity/User";
import { UserServiceInterface } from "../Port/Out/Service/UserServiceInterface";

export class UserService{
    userServiceInterface: UserServiceInterface

    constructor(userServiceInterface : UserServiceInterface){
        this.userServiceInterface = userServiceInterface
    }

    canCreateUser(user : User): void{
        if(this.userServiceInterface.isExistEmail(user.email)){
            throw new Error("Il existe déjà un compte qui utilise cette adresse email")
        }
        else if(this.userServiceInterface.isExistName(user.name)){
            throw new Error("Il existe déjà un compte qui utilise ce nom")
        }
    }
}