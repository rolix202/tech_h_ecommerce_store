import { Router } from "express";
import { createProduct, getAllProducts, updateProductImagesOnly, updateProductInfoAndImages, updateProductInfoOnly } from "../controllers/product.controller.js";
import { productUpdateValidation, productValidation, validateProductFilters } from "../middlewares/validation.middleware.js";
import { isAunthenticated } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.check.middleware.js";

const router = Router()


router.route("/")
    .post(isAunthenticated, checkRole("admin"), productValidation, createProduct)
    .get(validateProductFilters, getAllProducts)

router.patch("/:id", productUpdateValidation, updateProductInfoOnly)
router.patch("/:id/images", updateProductImagesOnly)
router.patch("/:id/update", updateProductInfoAndImages)

export default router