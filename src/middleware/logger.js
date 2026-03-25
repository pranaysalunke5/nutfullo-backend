import colors from 'colors';

export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(
            colors.magenta(`${req.method} ${req.originalUrl} `) +
            colors.yellow(`${res.statusCode} `) +
            colors.cyan(`(${duration}ms)`)
        );
    });

    next();
};