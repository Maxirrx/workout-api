import { User } from "../../Domain/Entity/User";

export interface UserRepositoryInterface {
    findByEmail(email: string): User | undefined
    findByName(name: string) : User | undefined
}

export class userRepository implements UserRepositoryInterface{
    findByEmail(email: string): User | undefined {
        
    }

    findByName(name: string): User | undefined{
        
    }
}