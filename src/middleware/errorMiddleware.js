import colors from 'colors';

// 1. 404 Not Found Middleware
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// 2. Global Error Handler
export const errorHandler = (err, req, res, next) => {
    // Sometimes errors don't have a status code, so we default to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    console.error(colors.red.bold(`[Error]: ${err.message}`));

    res.status(statusCode).json({
        success: false,
        message: err.message,
        // Only show stack trace in development mode for security
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};