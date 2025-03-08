import { pool } from "../configs/conn.js"
import { insertProductDetails, insertProductImages } from "../models/product.model.js"

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