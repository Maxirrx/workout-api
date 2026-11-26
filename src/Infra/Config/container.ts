import "reflect-metadata";
import { container } from "tsyringe";

import { userRepository } from "../Repository/UserRepository";
import { UserService } from "../Service/UserService";
import { DUserService } from "../../Domain/Service/DUserService";
import { UserController } from "../Http/Controller/UserController";
import { IUserService } from "../../Domain/Port/Out/Service/IUserService";
import { IExerciceRepository } from "../../Domain/Port/Out/Repository/IExerciceRepository";
import { ExerciceRepository } from "../Repository/ExerciceRepository";
import { ExerciceService } from "../Service/ExerciceService";
import { IExerciceService } from "../../Domain/Port/Out/Service/IExerciceService";
import { ExerciceController } from "../Http/Controller/ExerciceController";
import { IUserRepository } from "../../Domain/Port/Out/Repository/IUserRepository";
import { IWorkoutTemplateRepository } from "../../Domain/Port/Out/Repository/IWorkoutTemplateRepository";
import { IWorkoutTemplateService } from "../../Domain/Port/Out/Service/IWorkoutTemplateService";
import { WorkoutTemplateRepository } from "../Repository/WorkoutTemplateRepository";
import { WorkoutTemplateService } from "../Service/WorkoutTemplateService";
import { WorkoutTemplateController } from "../Http/Controller/WorkoutTemplateController";

// ==================== USER ====================

container.register<IUserRepository>("IUserRepository", { useClass: userRepository });

container.register(DUserService, { useFactory: (c) => new DUserService(c.resolve<IUserRepository>("IUserRepository")) });

container.register(UserService, { useFactory: (c) => new UserService(c.resolve<IUserRepository>("IUserRepository"), c.resolve(DUserService)) });

container.register("IUserService", { useFactory: (c) => c.resolve(UserService) });

container.register(UserController, { useFactory: (c) => new UserController(c.resolve(UserService)) });

// ==================== EXERCICE ====================

container.register<IExerciceRepository>("IExerciceRepository", { useClass: ExerciceRepository });

container.register(ExerciceService, { useFactory: (c) => new ExerciceService(c.resolve<IExerciceRepository>("IExerciceRepository")) });

container.register<IExerciceService>("IExerciceService", { useFactory: (c) => c.resolve(ExerciceService) });

container.register(ExerciceController, { useFactory: (c) => new ExerciceController(c.resolve(ExerciceService)) });

// ==================== WORKOUT TEMPLATE ====================

container.register<IWorkoutTemplateRepository>("IWorkoutTemplateRepository", {
  useFactory: (c) => new WorkoutTemplateRepository(c.resolve<IUserRepository>("IUserRepository"), c.resolve<IExerciceRepository>("IExerciceRepository"))
});

container.register(WorkoutTemplateService, { useFactory: (c) => new WorkoutTemplateService(c.resolve<IWorkoutTemplateRepository>("IWorkoutTemplateRepository")) });

container.register<IWorkoutTemplateService>("IWorkoutTemplateService", { useFactory: (c) => c.resolve(WorkoutTemplateService) });

container.register(WorkoutTemplateController, { useFactory: (c) => new WorkoutTemplateController(c.resolve(WorkoutTemplateService)) });
