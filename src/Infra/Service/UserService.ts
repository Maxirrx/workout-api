import { IUserService } from "../../Domain/Port/Out/Service/IUserService";
import { IUserRepository } from "../Repository/UserRepository";

export class UserService implements IUserService{
    IUserRepository : IUserRepository

    constructor(IUserRepository : IUserRepository){
        this.IUserRepository = IUserRepository
    }

    isExistEmail(email : string): boolean {
        const user = this.IUserRepository.findByEmail(email)
        if(user === undefined){
            return true
        }
        return false
    }

    isExistName(name : string): boolean {
        const user = this.IUserRepository.findByName(name)
        if(user === undefined){
            return true
        }
        return false
    }
}