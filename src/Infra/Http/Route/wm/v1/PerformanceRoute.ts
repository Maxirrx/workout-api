import { Router } from "express";
import { container } from "tsyringe";
import { PerformanceController } from "../../../Controller/PerformanceController";

const router = Router();
const controller = container.resolve(PerformanceController);

router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);

export default router;
