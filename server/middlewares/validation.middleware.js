import { body, validationResult } from "express-validator";
import AppError from "../utils/customError.js";

const withErrorMessage = (validations) => {
    return [
        ...validations,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new AppError(errors.array().map(err => err.msg).join(", "), 400));
            }
            next();
        }
    ];
};

export const signUpValidation = withErrorMessage([
    body("name")
        .notEmpty().withMessage("Name is required")
        .trim()
        .matches(/^[a-zA-Z\s]+$/).withMessage("Name must contain only alphabets")
        .escape(),

    body("email")
        .isEmail().withMessage("Not a valid email address")
        .trim()
        .normalizeEmail(),

    body("phoneNo")
        .matches(/^(?:\+234|0)[789][01]\d{8}$/)
        .withMessage("Invalid phone no. Use format like +2349012345678 or 09012345678"),

    body("gender")
        .isIn(["male", "female"]).withMessage("Gender must be 'male' or 'female'"),

    body("state")
        .notEmpty().withMessage("State is required")
        .trim(),

    body("city")
        .notEmpty().withMessage("City is required")
        .trim(),

    body("address")
        .notEmpty().withMessage("Address is required")
        .trim(),

    body("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
                throw new AppError("Passwords do not match", 400);
            }
            return true;
        })
]);
