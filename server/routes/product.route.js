import { Router } from "express";
import { createProduct } from "../controllers/product.controller.js";
import { productValidation } from "../middlewares/validation.middleware.js";

const router = Router()


router.post("/", productValidation, createProduct)

export default router