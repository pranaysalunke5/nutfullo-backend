import app from './src/app.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(
        colors.yellow.bold(`
    🚀 Nutfullo Unified Backend Running!
    📡 API URL: https://api.nutfullo.com
    🌍 Mode:    ${process.env.NODE_ENV || 'production'}
    📦 Port:    ${PORT}
        `)
    );
});

process.on('uncaughtException', (err) => {
    console.log(colors.red.bold(`FATAL ERROR: ${err.message}`));
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.log(colors.red(`Unhandled Rejection: ${err.message}`));
    server.close(() => process.exit(1));
});