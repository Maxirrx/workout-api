import "reflect-metadata";
import { container } from "tsyringe";
import { userRepository } from "../Repository/UserRepository";
import { UserService } from "../Service/UserService";
import { UserController } from "../Http/Controller/UserController";

container.register<userRepository>("IUserRepository", { useClass: userRepository });

