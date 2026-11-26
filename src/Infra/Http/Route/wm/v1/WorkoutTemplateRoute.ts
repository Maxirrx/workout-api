import { Router } from "express";
import { container } from "tsyringe";
import { WorkoutTemplateController } from "../../../Controller/WorkoutTemplateController";

const router = Router();
const workoutTemplateController = container.resolve(WorkoutTemplateController);

router.post("/", workoutTemplateController.create);

router.put("/:id", workoutTemplateController.update);

router.delete("/:id", workoutTemplateController.delete);

router.get("/", workoutTemplateController.findAll);

router.get("/:id", workoutTemplateController.findById);

export default router;
