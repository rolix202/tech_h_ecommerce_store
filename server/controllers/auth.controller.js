import passport from "passport"
import { signUpLogic, verifyEmailLogic } from "../services/auth.services.js"
import { generateToken, setCookie } from "../utils/generateTokenAndSetCookie.js"
import AppError from "../utils/customError.js"

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

export const login = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
        throw new AppError(info.message || "Invalid Credentials", 400)
    }

    const { token, refresh_token } = generateToken(user.id);

    setCookie(res, token, refresh_token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  })(req, res, next);
};

export const verifyEmail = async (req, res, next) => {
  try {
    const result = await verifyEmailLogic(req.body)

    res.status(200).json(result)
    
  } catch (error) {
    next(error)
  }
}

export const userProfile = async (req, res, next) => {
  const { user } = req

  res.status(200).json(user)
}
