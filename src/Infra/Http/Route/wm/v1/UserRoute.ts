import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../../../Controller/UserController";

const router = Router();
const userController = container.resolve(UserController);

router.post("/", userController.create);

router.get("/name/:name", userController.findByName);

router.get("/email/:email", userController.findByEmail);

router.get("/:id", userController.findById);

export default router;
