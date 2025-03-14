import bcrypt from "bcryptjs"
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

// local imports
import { createUserQuery, getUserByIdQuery, getUserPassword, loginUserQuery, updateLastLogin, updateUserVerification, verifyEmailTokenQuery } from "../models/auth.model.js"
import { sendVerificationToken, sendWelcomeMessage } from "../libs/mailtrap/emails.js"
import AppError from "../utils/customError.js"

export const signUpLogic = async (userData) => {

    const { name, email, phoneNo, gender, state, city, address, password } = userData

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = Math.floor(10000 + Math.random() * 900000).toString()
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        const user = await createUserQuery({ name, email, phoneNo, gender, state, city, address, password: hashedPassword, verificationToken, verificationTokenExpiresAt })

        const emailSent = await sendVerificationToken(user.email, user.name, verificationToken)

        if (!emailSent){
            throw new AppError("Email verification failed. Please try again.", 400)
        }

        return user
    } catch (error) {
        console.error("Singup error: ", error);
        throw error
    } 

}

export const passportLoginAuthStrategy = () => {

passport.use(new LocalStrategy({ usernameField: "email" }, async function verify(email, password, cb) {
    try {
        const user = await loginUserQuery(email);

        if (!user) {
          return cb(null, false, { message: "Incorrect email or password." });
        }

        const hashedPassword = await getUserPassword(email)

        const isMatch = await bcrypt.compare(password, hashedPassword.password);

        if (!isMatch) {
          return cb(null, false, { message: "Incorrect email or password." });
        }

        await updateLastLogin(user.id)

        return cb(null, user);
      } catch (error) {
        console.log("Error authenticating user:", error);
        return cb(error);
      }
  }));

  let cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies.token;
    }
    return token;
};

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

passport.use(new JwtStrategy(jwtOptions, async function(payload, done) {
    
    try {
        const user = await getUserByIdQuery(payload.userId)

        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
        
    } catch (error) {
        console.log("Error in authentication: ", error);
        done(error, false)
    }
}));
};

export const verifyEmailLogic = async (data) => {
    const { token } = data
    try {
        const user = await verifyEmailTokenQuery(token)

        if (!user){
            throw new AppError("Invalid or expired verification token.", 400)
        }

        
        if (new Date(user.verificationtokenexpiresat) < new Date()){
            throw new AppError("Verification token has expired. Please request a new one.", 400)
        }

        await updateUserVerification(user.id)

        await sendWelcomeMessage(user.email, user.name)
        
        return {
            success: true,
            message: "Email verified successfully"
        }

    } catch (error) {
        console.error("Error verifying email:", error);
        throw error
    }
    
}


