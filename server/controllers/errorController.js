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

const duplicateValueError = (err) => {
    return new AppError("Email already exists", 400);
};

export const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || 'error'

    if (process.env.NODE_ENV === "development") {
        devError(res, error)
    } else if (process.env.NODE_ENV === "production") {

        if (error.code === "23505") return duplicateValueError(error)

        prodError(res, error)
    }
}