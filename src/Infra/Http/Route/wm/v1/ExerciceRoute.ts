import { Router } from "express";
import { container } from "tsyringe";
import { ExerciceController } from "../../../Controller/ExerciceController";

const router = Router();
const exerciceController = container.resolve(ExerciceController);

router.post("/", exerciceController.create);

router.put("/:id", exerciceController.update);

router.delete("/:id", exerciceController.delete);

router.get("/", exerciceController.findAll);

router.get("/:id", exerciceController.findById);

export default router;
