import { pool } from "../configs/conn.js"
import { checkProductExistsQuery, fetchAllProductsQuery, insertProductDetails, insertProductImages, updateProductInforQuery } from "../models/product.model.js"
import AppError from "../utils/customError.js"

export const createProductLogic = async (data) => {

    const client = await pool.connect()

    const { images, ...productDetails } = data

    try {
        
        await client.query("BEGIN")

        const productResponse = await insertProductDetails(client, productDetails)

        await insertProductImages(client, productResponse.id, images)

        await client.query("COMMIT")

        return {
            success: true,
            message: "Product and images inserted successfully."
        }

    } catch (error) {
        await client.query("ROLLBACK")
        console.error("Error creating product at product.services:", error);
        throw error
    } finally {
        client.release()
    }
    
}

export const fetchProductsLogic = async (filters) => {
    try {
        return await fetchAllProductsQuery(filters)

    } catch (error) {
        console.error("Error fetching products at product.services:", error);
        throw error
    }
}

export const updateProductInfoLogic = async (id, updateFields) => {
        
    if (!id) throw new AppError("Prouct ID is required", 400);

    const productExists = await checkProductExistsQuery(id)

    if (!productExists) throw new AppError("Product not found", 404);  

    const allowedFields = ["name", "description", "unit_price", "stock", "category", "brand"];

    
    const fieldsToUpdate = Object.fromEntries(
        Object.entries(updateFields).filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
    );    
    
    if (Object.keys(fieldsToUpdate).length === 0) throw new AppError("No valid fields to update", 400);

    return await updateProductInforQuery(id, fieldsToUpdate);
}