import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import passport from "passport"

// local imports
import AppError from "./utils/customError.js"
import { globalErrorHandler } from "./controllers/errorController.js"
import authRoute from "./routes/auth.route.js"
import { passportLoginAuthStrategy } from "./services/auth.services.js"
import productRoute from "./routes/product.route.js"


dotenv.config()
const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

passportLoginAuthStrategy()
app.use(passport.initialize())

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/products", productRoute)


app.get("/", (req, res) => {
    res.send("Server running successfully")
})

app.all("*", (req, res, next) => {
    const err = new AppError(`The requested URL ${req.originalUrl} does not exist on the server`, 404)

    next(err)
})

app.use(globalErrorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    
})