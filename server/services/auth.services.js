import bcrypt from "bcryptjs"
import { createUserQuery } from "../models/auth.model.js"

export const signUpLogic = async (userData) => {
    const { name, email, phoneNo, gender, state, city, address, password } = userData

    const hashedPassword = await bcrypt.hash(password, 10)
    
    return await createUserQuery({ name, email, phoneNo, gender, state, city, address, password: hashedPassword })
}