import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../../../Controller/UserController";

const router = Router();
const userController = container.resolve(UserController);

router.post("/", userController.create);

router.put("/:id", userController.update);

router.delete("/:id", userController.delete);

router.get("/", userController.findAll);

router.get("/name/:name", userController.findByName);

router.get("/email/:email", userController.findByEmail);

router.get("/:id", userController.findById);

router.post("/disable/:id", userController.disable);

router.post("/enable/:id", userController.enable);

export default router;
