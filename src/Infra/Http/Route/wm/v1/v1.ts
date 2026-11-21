
import { Router } from "express";
import userRouter from "./UserRoute";
import exerciceRouter from "./ExerciceRoute"

const router = Router();

router.use("/users", userRouter);
router.use("/exercices", exerciceRouter);

export default router;
