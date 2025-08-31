import { Router } from "express";
import { login } from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.get("/test", (_req, res) => {
  res.json({ message: "Auth routes working!" });
});
export default router;
