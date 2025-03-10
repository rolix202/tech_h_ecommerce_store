import { createProductLogic, fetchProductsLogic } from "../services/product.services.js"
import AppError from "../utils/customError.js";

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

export const getAllProducts = async (req, res, next) => {
    
    const { category, brand, minPrice, maxPrice, search, sortBy, order, page, limit } = req.query

    try {

        const filters = {
            category: category,
            brand: brand,
            minPrice: minPrice,
            maxPrice: maxPrice,
            search: search,
            sortBy: sortBy,
            order: order,
            page: page,
            limit: limit,
        }

        const response = await fetchProductsLogic(filters)

        if (!response || response.products.length === 0){
            return next(new AppError("No products found.", 404))
        }

        return res.status(200).json({
            success: true,
            count: response.products.length,
            totalPages: response.totalPages,
            currentPage: response.currentPage,
            data: response.products
        })

    } catch (error) {
        console.error("Error fetching products at product.controllers:", error);
        next(error)
    }
    
}