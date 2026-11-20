import { UserServiceInterface } from "../../Domain/Port/Out/Service/UserServiceInterface";
import { UserRepositoryInterface } from "../Repository/UserRepository";

export class UserService implements UserServiceInterface{
    userRepository : UserRepositoryInterface

    constructor(userRepository : UserRepositoryInterface){
        this.userRepository = userRepository
    }

    isExistEmail(email : string): boolean {
        const user = this.userRepository.findByEmail(email)
        if(user === undefined){
            return true
        }
        return false
    }

    isExistName(name : string): boolean {
        const user = this.userRepository.findByName(name)
        if(user === undefined){
            return true
        }
        return false
    }
}