import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, _req, res, _next) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], error.stack);
    }

    let { statusCode, message, errors } = error;

    if (err.code === "P2002") {
        statusCode = 409;
        message = "Duplicate value already exists";
    }

    if (err.code === "P2025") {
        statusCode = 404;
        message = "Record not found";
    }

    const isDev = process.env.NODE_ENV === "development";

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
        ...(isDev && { stack: error.stack }),
    });
};

export { errorHandler };
