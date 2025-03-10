import { pool } from "../configs/conn.js"
import { fetchAllProductsQuery, insertProductDetails, insertProductImages } from "../models/product.model.js"

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