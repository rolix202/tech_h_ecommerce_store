import bcrypt from "bcryptjs"
import { createUserQuery } from "../models/auth.model.js"
import { sendVerificationToken } from "../libs/mailtrap/emails.js"
import { pool } from "../configs/conn.js"
import AppError from "../utils/customError.js"

export const signUpLogic = async (userData) => {

    const client = await pool.connect() // getting a client for transaction

    const { name, email, phoneNo, gender, state, city, address, password } = userData

    try {

        await client.query("BEGIN") // Start of transaction

        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = Math.floor(10000 + Math.random() * 900000).toString()
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        const user = await createUserQuery(client, { name, email, phoneNo, gender, state, city, address, password: hashedPassword, verificationToken, verificationTokenExpiresAt })

        const emailSent = await sendVerificationToken(user.email, user.name, verificationToken)

        if (!emailSent){
            throw new AppError("Email verification failed. Please try again.", 500)
        }

        await client.query("COMMIT")

        return user
    } catch (error) {
        await client.query("ROLLBACK") // Rollback if any fails
        console.error("Singup error: ", error);
        throw error
    } finally {
        client.release()
    }

}