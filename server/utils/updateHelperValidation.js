import { checkProductExistsQuery } from "../models/product.model.js";
import AppError from "./customError.js";

export const updateCheck = async (id, updateFields) => {
    if (!id) throw new AppError("Prouct ID is required", 400);
    
    const productExists = await checkProductExistsQuery(id) 

    if (!productExists) throw new AppError("Product not found", 404);

    const allowedFields = ["name", "description", "unit_price", "stock", "category", "brand"];

    const invalidFields = Object.keys(updateFields || {}).filter((key) => !allowedFields.includes(key));

    if (invalidFields.length > 0) {
        throw new AppError(`Invalid fields provided: ${invalidFields.join(", ")}`, 400);
    }

    const fieldsToUpdate = Object.fromEntries(
        Object.entries(updateFields).filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
    );

    if (Object.keys(fieldsToUpdate).length === 0) throw new AppError("No valid fields to update", 400);

    return fieldsToUpdate 
}