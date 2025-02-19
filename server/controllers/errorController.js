const devError = (res, error) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error: error
    })
}

const prodError = (res, error) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    })
}

export const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || 'error'

    if (process.env.NODE_ENV === "development") {
        devError(res, error)
    } else if (process.env.NODE_ENV === "production") {
        prodError(res, error)
    }
}