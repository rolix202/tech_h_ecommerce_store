import { createProductLogic } from "../services/product.services.js"

export const createProduct = async (req, res, next) => {
    try {
        const result = await createProductLogic(req.body)

        return res.status(201).json(result)
        
    } catch (error) {
        console.error("Error creating product at product.controllers:", error);
        return res.status(400).json({
            success: false,
            message: error.message || "Something went wrong."
        });
    }
}