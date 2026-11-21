import "reflect-metadata";
import { container } from "tsyringe";

import { userRepository, IUserRepository } from "../Repository/UserRepository";
import { UserService } from "../Service/UserService";
import { DUserService } from "../../Domain/Service/DUserService";
import { UserController } from "../Http/Controller/UserController";
import { IUserService } from "../../Domain/Port/Out/Service/IUserService";

container.register<IUserRepository>("IUserRepository", {
  useClass: userRepository
});

container.register(DUserService, {
  useFactory: (c) => new DUserService(c.resolve<IUserRepository>("IUserRepository"))
});

container.register(UserService, {
  useFactory: (c) => new UserService(c.resolve<IUserRepository>("IUserRepository"), c.resolve(DUserService))
});

container.register("IUserService", {
  useFactory: (c) => c.resolve(UserService)
});

container.register(UserController, {
  useFactory: (c) => new UserController(c.resolve(UserService))
});
