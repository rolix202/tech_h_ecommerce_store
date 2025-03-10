import { Router } from "express";
import { createProduct, getAllProducts } from "../controllers/product.controller.js";
import { productValidation, validateProductFilters } from "../middlewares/validation.middleware.js";
import { isAunthenticated } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.check.middleware.js";

const router = Router()


router.route("/")
    .post(isAunthenticated, checkRole("admins"), productValidation, createProduct)
    .get(validateProductFilters, getAllProducts)

export default router