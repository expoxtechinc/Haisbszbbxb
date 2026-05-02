import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import schoolDataRouter from "./schoolData";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(schoolDataRouter);

export default router;
