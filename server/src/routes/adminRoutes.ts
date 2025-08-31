import { Router } from "express";
import { getDashboardStats } from "../controllers/adminController.js";

const router = Router();

// GET /api/dashboard
router.get("/dashboard", getDashboardStats);

export default router;
