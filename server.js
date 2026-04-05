import app from './src/app.js';
import connectDB from './src/config/db.js';
import './src/config/env.js';

import dotenv from 'dotenv';
dotenv.config();
import colors from 'colors';

// 1. Load Environment Variables (.env file)
dotenv.config();

// 2. Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// 3. Start Server
// const server = app.listen(PORT, () => {
//     console.log(
//         colors.yellow.bold(`
//     🚀 Nutfullo Backend is Running!
//     📡 URL:  http://localhost:${PORT}
//     🛠️  Mode: ${process.env.NODE_ENV || 'development'}
//         `)
//     );
// });

const server = app.listen(PORT, () => {
    console.log(
        colors.yellow.bold(`
    🚀 Nutfullo Backend is Running!
    📡 URL:  https://api.nutfullo.com
    🛠️  Mode: ${process.env.NODE_ENV || 'production'}
        `)
    );
});

// Handle unhandled promise rejections (Optional but recommended)
process.on('unhandledRejection', (err) => {
    console.log(colors.red(`Error: ${err.message}`));
    // Close server & exit process
    server.close(() => process.exit(1));
});