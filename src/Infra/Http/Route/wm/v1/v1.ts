
import { Router } from "express";
import userRouter from "./UserRoute";
import exerciceRouter from "./ExerciceRoute"
import workoutTemplateRouter from "./WorkoutTemplateRoute"

const router = Router();

router.use("/users", userRouter);
router.use("/exercices", exerciceRouter);
router.use("/exercices", workoutTemplateRouter);

export default router;
