import { NextFunction, Request, Response } from "express";
import { Performance } from "../../../Domain/Entity/Performance";
import { Exercice } from "../../../Domain/Entity/Exercice";
import { WorkoutSession } from "../../../Domain/Entity/WorkoutSession";
import { IPerformanceService } from "../../../Domain/Port/Out/Service/IPerformanceService";
import { ApiError } from "../../../Utils/ApiError";

function isId(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function readId(value: unknown): number {
  if (typeof value === "string" && /^[0-9]+$/.test(value)) {
    const id = Number(value);
    if (isId(id)) {
      return id;
    }
  }
  throw new ApiError(400, "Identifiant de performance invalide", "INVALID_PERFORMANCE_ID");
}

function readMetric(value: unknown, field: string, max: number, integer: boolean): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > max || (integer && !Number.isInteger(value))) {
    throw new ApiError(400, `Valeur invalide pour ${field}`, "INVALID_PERFORMANCE_DATA");
  }
  return value;
}

function readPerformance(id: number, body: Request["body"]): Performance {
  const { exercice, workout_session, weight, rep, time, rest } = body ?? {};
  if (!isId(exercice?.id) || !isId(workout_session?.id)) {
    throw new ApiError(400, "Données de performance invalides", "INVALID_PERFORMANCE_DATA");
  }
  const maxInteger = 2_147_483_647;
  return new Performance(
    id,
    exercice as Exercice,
    readMetric(weight, "weight", 999_999.99, false),
    readMetric(rep, "rep", maxInteger, true),
    readMetric(time, "time", maxInteger, false),
    readMetric(rest, "rest", maxInteger, false),
    workout_session as WorkoutSession
  );
}

function serialize(performance: Performance) {
  const { exercice, workout_session, ...metrics } = performance;
  return {
    ...metrics,
    exercice: { id: Number(exercice.id), name: exercice.name },
    workout_session: { id: workout_session.id, date_of_workout: workout_session.date_of_workout, is_end: workout_session.is_end }
  };
}

export class PerformanceController {
  constructor(private readonly performanceService: IPerformanceService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const performance = await this.performanceService.create(readPerformance(0, req.body));
      res.status(201).json({ message: "Performance créée avec succès", performance: serialize(performance) });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const performance = await this.performanceService.findById(readId(req.params.id));
      if (!performance) {
        res.status(404).json({ error: "Performance introuvable" });
        return;
      }
      res.status(200).json({ performance: serialize(performance) });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const performances = await this.performanceService.findAll();
      res.status(200).json({ performances: performances.map(serialize) });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const performance = await this.performanceService.update(readPerformance(readId(req.params.id), req.body));
      if (!performance) {
        res.status(404).json({ error: "Performance introuvable" });
        return;
      }
      res.status(200).json({ performance: serialize(performance) });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleted = await this.performanceService.delete(readId(req.params.id));
      res.status(deleted ? 200 : 404).json({ deleted });
    } catch (error) {
      next(error);
    }
  };
}
