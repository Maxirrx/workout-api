import { ApiError } from "./ApiError";
import type { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message, code: err.code });
    return;
  }

  console.error(err);
  res.status(500).json({ message: err.message });
}
