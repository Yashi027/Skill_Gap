import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import protect from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", protect, getMe);

export default router;