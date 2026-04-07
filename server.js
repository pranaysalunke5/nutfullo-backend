// import app from './src/app.js';
// import connectDB from './src/config/db.js';
// import './src/config/env.js';

// import dotenv from 'dotenv';
// dotenv.config();
// import colors from 'colors';

// // 1. Load Environment Variables (.env file)
// dotenv.config();

// // 2. Connect to MongoDB
// connectDB();

// const PORT = process.env.PORT || 5000;


// const server = app.listen(PORT, () => {
//     console.log(
//         colors.yellow.bold(`
//     🚀 Nutfullo Backend is Running!
//     📡 URL:  https://api.nutfullo.com
//     🛠️  Mode: ${process.env.NODE_ENV || 'production'}
//         `)
//     );
// });

// // Handle unhandled promise rejections (Optional but recommended)
// process.on('unhandledRejection', (err) => {
//     console.log(colors.red(`Error: ${err.message}`));
//     // Close server & exit process
//     server.close(() => process.exit(1));
// });


import app from './src/app.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import colors from 'colors';

// 1. Load Environment Variables
dotenv.config();

// 2. Connect to MongoDB
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

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
    console.log(colors.red.bold(`FATAL ERROR: ${err.message}`));
    process.exit(1);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
    console.log(colors.red(`Unhandled Rejection: ${err.message}`));
    server.close(() => process.exit(1));
});