import { body, query, validationResult } from "express-validator";
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

export const loginValidation = withErrorMessage([
    body("email")
        .isEmail().withMessage("Not a valid email address.")
        .trim()
        .normalizeEmail(),

    body("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
]);

export const emailTokenValidation = withErrorMessage([
    body("token").notEmpty().withMessage("Token is required.").isNumeric().withMessage("Invalid or missing verification token.")
])

export const productValidation = withErrorMessage([
    body("name")
        .notEmpty().withMessage("Product name is required")
        .trim()
        .escape(),

    body("description")
        .notEmpty().withMessage("Product description is required")
        .trim()
        .escape(),

    body("unit_price")
        .notEmpty().withMessage("Unit price is required")
        .isFloat({ min: 0 }).withMessage("Unit price must be a positive number"),

    body("stock")
        .notEmpty().withMessage("Stock quantity is required")
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

    body("category")
        .notEmpty().withMessage("Category is required")
        .trim()
        .escape(),

    body("brand")
        .notEmpty().withMessage("Brand is required")
        .trim()
        .escape(),

    body("images")
        .optional()
        .isArray({ min: 1 }).withMessage("Images should be an array with at least one image URL"),
    
    body("images.*")
        .isURL().withMessage("Each image must be a valid URL")
]);

export const validateProductFilters = withErrorMessage([
    query("category")
        .optional()
        .trim()
        .isString()
        .withMessage("Category must be a valid string"),

    query("brand")
        .optional()
        .trim()
        .isString()
        .withMessage("Brand must be a valid string"),

    query("minPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be a positive number"),

    query("maxPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be a positive number"),

    query("search")
        .optional()
        .trim()
        .isString()
        .withMessage("Search query must be a string")
        .escape(),

    query("sortBy")
        .optional()
        .isIn(["name", "price", "created_at", "stock"])
        .withMessage("Invalid sortBy field."),

    query("order")
        .optional()
        .toUpperCase()
        .isIn(["ASC", "DESC"])
        .withMessage("Invalid order field. Allowed: ASC or DESC"),

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer")
        .toInt(),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100")
        .toInt(),

]);
