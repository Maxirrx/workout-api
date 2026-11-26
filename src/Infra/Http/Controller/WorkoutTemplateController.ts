import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { WorkoutTemplateService } from "../../Service/WorkoutTemplateService";
import { WorkoutTemplate } from "../../../Domain/Entity/WorkoutTemplate";
import { Exercice } from "../../../Domain/Entity/Exercice";
import { User } from "../../../Domain/Entity/User";

@injectable()
export class WorkoutTemplateController {
  constructor(private readonly workoutTemplateService: WorkoutTemplateService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, user, exercices, is_public } = req.body;

      if (typeof name !== "string" || !user || !Array.isArray(exercices) || typeof is_public !== "boolean") {
        res.status(400).json({ error: "Données workout template invalides" });
        return;
      }

      const workoutTemplate = new WorkoutTemplate(0, name, user as User, exercices as Exercice[], is_public);

      const createdWorkoutTemplate = await this.workoutTemplateService.create(workoutTemplate);

      res.status(201).json({ message: "Workout template créé avec succès", workoutTemplate: createdWorkoutTemplate });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: "id invalide" });
        return;
      }

      const workoutTemplate = await this.workoutTemplateService.findById(id);

      res.status(200).json({ workoutTemplate });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workoutTemplates = await this.workoutTemplateService.findAll();

      res.status(200).json({ workoutTemplates });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const { name, user, exercices, is_public } = req.body;

      if (typeof id !== "number" || !Number.isInteger(id) || id <= 0 || typeof name !== "string" || !user || !Array.isArray(exercices) || typeof is_public !== "boolean") {
        res.status(400).json({ error: "Données workout template invalides" });
        return;
      }

      const workoutTemplate = new WorkoutTemplate(id, name, user as User, exercices as Exercice[], is_public);

      const updatedWorkoutTemplate = await this.workoutTemplateService.update(workoutTemplate);

      res.status(200).json({ workoutTemplate: updatedWorkoutTemplate });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: "id invalide" });
        return;
      }

      const deleted = await this.workoutTemplateService.delete(id);

      res.status(200).json({ deleted });
    } catch (error) {
      next(error);
    }
  };
}
