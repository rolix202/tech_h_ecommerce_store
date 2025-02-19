import { query } from "../configs/conn.js"
import AppError from "../utils/customError.js";

export const createUserQuery = async (data) => {
    const { name, email, phoneNo, gender, state, city, address, password } = data

    try {
        const { rowCount } = await query("SELECT 1 FROM users WHERE email = $1 LIMIT 1", [email]);
                    
        if (rowCount > 0) {
            throw new AppError("Email already exists", 409);
        }

        const { rows } = await query("INSERT INTO users (name, email, phoneNo, gender, state, city, address, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, phoneNo, gender, state, city, address", [name, email, phoneNo, gender, state, city, address, password])

        return rows[0]
        
    } catch (error) {
        console.log("Error creating user:", error);
        throw error 
    }
}
