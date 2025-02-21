import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"

// local imports
import AppError from "./utils/customError.js"
import { globalErrorHandler } from "./controllers/errorController.js"
import authRoute from "./routes/auth.route.js"
import cookieParser from "cookie-parser"

dotenv.config()
const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/auth", authRoute)

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