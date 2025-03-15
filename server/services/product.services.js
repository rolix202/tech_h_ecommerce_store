import { pool } from "../configs/conn.js"
import { checkProductExistsQuery, deletePreviousImages, fetchAllProductsQuery, insertProductDetails, insertProductImages, updateProductImagesQuery, updateProductInforQuery } from "../models/product.model.js"
import AppError from "../utils/customError.js"
import { isValidURL } from "../utils/isValidImageUrl.js"
import { updateCheck } from "../utils/updateHelperValidation.js"

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

    const fieldsToUpdate = await updateCheck(id, updateFields)

    let client = false

    return await updateProductInforQuery(client, id, fieldsToUpdate);
}

export const updateProductImagesLogic = async (id, images) => {
    if (!id) throw new AppError("Product ID is required.", 400);
    if (!Array.isArray(images) || images.length === 0) throw new AppError("At least one image URL is required", 400);
    if (!images.every(isValidURL)) throw new AppError("Invalid image format.", 400); 

    const client = await pool.connect();
    if (!client) throw new AppError("Database connection failed", 500);

    try {
        const productExists = await checkProductExistsQuery(id);
        if (!productExists) throw new AppError("Product not found", 404);

        await client.query("BEGIN");

        await deletePreviousImages(client, id);
        const response = await updateProductImagesQuery(client, id, images);

        await client.query("COMMIT");
        return response;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const updateProductInfoAndImagesLogic = async (id, updateFields, images) => {
    const client = await pool.connect();

    const fieldsToUpdate = await updateCheck(id, updateFields)

    try {
        await client.query("BEGIN");

        const product = await updateProductInforQuery(client, id, fieldsToUpdate);

        let productImages;

        if (Array.isArray(images) && images.length > 0) {
            productImages = await updateProductImagesQuery(client, id, images);
        }

        await client.query("COMMIT");

        return { ...product, images: productImages };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error updating product info and images:", error);
        throw new AppError("Failed to update product info and images", 500);
    } finally {
        client.release();
    }
};



