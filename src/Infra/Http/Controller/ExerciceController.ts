import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { ExerciceService } from "../../Service/ExerciceService";
import { Exercice } from "../../../Domain/Entity/Exercice";
import { Muscle } from "../../../Domain/Entity/Muscle";
import { User } from "../../../Domain/Entity/User";

@injectable()
export class ExerciceController {
  constructor(private readonly exerciceService: ExerciceService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, muscle_1, muscle_2, muscle_3, user, is_public } = req.body;

      if (typeof name !== "string" || !muscle_1 || !user || typeof is_public !== "boolean") {
        res.status(400).json({ error: "Données exercice invalides" });
        return;
      }

      const exercice = new Exercice(0, name, muscle_1 as Muscle, muscle_2 as Muscle | undefined, muscle_3 as Muscle | undefined, user as User, is_public);

      const createdExercice = await this.exerciceService.create(exercice);

      res.status(201).json({ message: "Exercice créé avec succès", exercice: createdExercice });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        res.status(400).json({ error: "id invalide" });
        return;
      }

      const exercice = await this.exerciceService.findById(id);

      if (!exercice) {
        res.status(404).json({ error: "Exercice introuvable" });
        return;
      }

      res.status(200).json({ exercice });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const exercices = await this.exerciceService.findAll();

      res.status(200).json({ exercices: exercices ?? [] });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, name, muscle_1, muscle_2, muscle_3, user, is_public } = req.body;

      if (id === undefined || typeof name !== "string" || !muscle_1 || !user || typeof is_public !== "boolean") {
        res.status(400).json({ error: "Données exercice invalides" });
        return;
      }

      const exercice = new Exercice(id, name, muscle_1 as Muscle, muscle_2 as Muscle | undefined, muscle_3 as Muscle | undefined, user as User, is_public);

      const updatedExercice = await this.exerciceService.update(exercice);

      res.status(200).json({ exercice: updatedExercice });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        res.status(400).json({ error: "id invalide" });
        return;
      }

      const deleted = await this.exerciceService.delete(id);

      res.status(deleted ? 200 : 404).json({ deleted });
    } catch (error) {
      next(error);
    }
  };
}
