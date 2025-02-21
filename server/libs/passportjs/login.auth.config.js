import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { getUserByIdQuery, loginUserQuery } from "../../models/auth.model.js";

export const passportLoginAuthStrategy = () => {

passport.use(new LocalStrategy({ usernameField: "email" }, async function verify(email, password, cb) {
    try {
        const user = await loginUserQuery(email);

        if (!user) {
          return cb(null, false, { message: "Incorrect email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return cb(null, false, { message: "Incorrect email or password." });
        }

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
        
    }
}));
};


