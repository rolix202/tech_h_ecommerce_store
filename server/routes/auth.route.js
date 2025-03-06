import { Router } from "express";
import { login, signUp, userProfile, verifyEmail } from "../controllers/auth.controller.js";
import { emailTokenValidation, loginValidation, signUpValidation } from "../middlewares/validation.middleware.js";
import { isAunthenticated } from "../middlewares/auth.js";

const router = Router()

router.post("/sign-up", signUpValidation, signUp)
router.post("/login", loginValidation, login)
router.post("/verify-email", emailTokenValidation, verifyEmail)
router.get("/profile", isAunthenticated, userProfile)

export default router