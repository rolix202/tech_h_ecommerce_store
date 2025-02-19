import { Router } from "express";
import { signUp } from "../controllers/auth.controller.js";
import { signUpValidation } from "../middlewares/validation.middleware.js";

const router = Router()

router.post("/sign-up", signUpValidation, signUp)

export default router