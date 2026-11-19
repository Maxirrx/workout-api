import { User } from "./User"

export class WorkoutTemplate {
    id : number
    name : string
    user : User
    is_public : boolean

    constructor(id: number, name : string, user : User, is_public : boolean){
        this.id = id
        this.name = name
        this.user = user
        this.is_public = is_public
    }
}
