import { Router } from "express";

const router = Router()
import * as dashboard from '../controllers/dashboard.controller.js'
import { verifyToken } from "../middlewares/auth.jwt.js";

router.get('/',[verifyToken], dashboard.getDashboardData);

export default router;