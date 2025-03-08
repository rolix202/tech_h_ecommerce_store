import passport from "passport";

export const isAunthenticated = passport.authenticate('jwt', { session: false })