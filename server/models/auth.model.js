import AppError from "../utils/customError.js";

export const createUserQuery = async (client, data) => {
    const { name, email, phoneNo, gender, state, city, address, password, verificationToken, verificationTokenExpiresAt } = data

    const queryText = `INSERT INTO users (name, email, phoneNo, gender, state, city, address, password, verificationtoken, verificationtokenexpiresat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, name, email, phoneNo, gender, state, city, address, status, lastlogin`;

    try {
        const { rows } = await client.query(queryText, [name, email, phoneNo, gender, state, city, address, password, verificationToken, verificationTokenExpiresAt])

        return rows[0]
        
    } catch (error) {
        if (error.code === "23505") {
            throw new AppError("Email already exists", 400);
        }
        console.log("Error creating user:", error);
        throw error 
    }
}
