
import { Router } from "express";
import userRouter from "./UserRoute";
import exerciceRouter from "./ExerciceRoute"
import workoutTemplateRouter from "./WorkoutTemplateRoute"

import performanceRouter from "./PerformanceRoute";

const router = Router();

router.use("/users", userRouter);
router.use("/exercices", exerciceRouter);
router.use("/exercices", workoutTemplateRouter);
router.use("/performances", performanceRouter);

export default router;
