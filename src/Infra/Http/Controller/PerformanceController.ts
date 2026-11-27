import { NextFunction, Request, Response } from "express";
import { IPerformanceService } from "../../../Domain/Port/Out/Service/IPerformanceService";
import { ApiError } from "../../../Utils/ApiError";

export class PerformanceController {
  constructor(private readonly performanceService: IPerformanceService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const performance = await this.performanceService.create(req.body);
      res.status(201).json(performance);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        throw new ApiError(400, "Identifiant invalide", "INVALID_ID");
      }

      const performance = await this.performanceService.findById(id);

      if (!performance) {
        res.status(404).json({ error: "Performance introuvable" });
        return;
      }

      res.status(200).json(performance);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const performances = await this.performanceService.findAll();
      res.status(200).json(performances);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        throw new ApiError(400, "Identifiant invalide", "INVALID_ID");
      }

      const performance = await this.performanceService.update({
        ...req.body,
        id
      });

      if (!performance) {
        res.status(404).json({ error: "Performance introuvable" });
        return;
      }

      res.status(200).json(performance);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        throw new ApiError(400, "Identifiant invalide", "INVALID_ID");
      }

      const deleted = await this.performanceService.delete(id);

      if (!deleted) {
        res.status(404).json({ error: "Performance introuvable" });
        return;
      }

      res.status(200).json({ deleted: true });
    } catch (error) {
      next(error);
    }
  };
}
