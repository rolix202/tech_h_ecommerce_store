import { Router } from "express";
import { createProduct } from "../controllers/product.controller.js";
import { productValidation } from "../middlewares/validation.middleware.js";
import { isAunthenticated } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.check.middleware.js";

const router = Router()


router.post("/", isAunthenticated, checkRole("admins", "moderator"), productValidation, createProduct)

export default router