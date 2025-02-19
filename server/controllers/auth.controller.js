import { signUpLogic } from "../services/auth.services.js"

export const signUp = async(req, res, next) => {
    try {
        const user = await signUpLogic(req.body)

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        })
        
    } catch (error) {
        next(error)
    }
}