import { Router } from "express";
import { login, signUp } from "../controllers/auth.controller.js";
import { signUpValidation } from "../middlewares/validation.middleware.js";

const router = Router()

router.post("/sign-up", signUpValidation, signUp)
router.post("/login", login)

export default router