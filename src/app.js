// import express from 'express';
// import cors from 'cors'; 
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// import { requestLogger } from './middleware/logger.js';

// // Route Imports
// import enquiryRoutes from './routes/enquiryRoutes.js';
// import onboardRoutes from './routes/onboardRoutes.js';
// import productRoutes from './routes/productRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
// import authRoutes from './routes/authRoutes.js';
// import cartRoutes from './routes/cartRoutes.js';

// const app = express();

// // 1. Secure Production CORS Configuration
// const whitelist = [
//     'https://nutfullo.com',      // Your Live Amplify Site
//     'https://www.nutfullo.com',
//     'http://localhost:5173',     // Your Local Vite Development
//     'http://localhost:3000' ,     // Your Local React Development
//     'http://127.0.0.1:5173',
// ];

// // const corsOptions = {
// //     origin: function (origin, callback) {
// //         // Allow requests with no origin (like mobile apps or Postman)
// //         if (!origin || whitelist.indexOf(origin) !== -1) {
// //             callback(null, true);
// //         } else {
// //             callback(new Error('Blocked by Nutfullo Security (CORS)'));
// //         }
// //     },
// //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// //     credentials: true,
// //     optionsSuccessStatus: 200
// // };


// const corsOptions = {
//     origin: function (origin, callback) {
//         console.log("🚀 Incoming Request Origin:", origin); 

//         if (!origin || whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error(`Blocked by Nutfullo Security (CORS): ${origin}`));
//         }
//     },
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     optionsSuccessStatus: 200
// };


// app.use(cors(corsOptions)); 

// // Limit JSON and URL-Encoded payloads to 2MB
// app.use(express.json({ limit: '2mb' }));
// app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// app.use(requestLogger); 

// // 2. API Routes
// app.use('/api/enquiries', enquiryRoutes);
// app.use('/api/onboard', onboardRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api', authRoutes);
// app.use('/api/cart/', cartRoutes);

// // app.post('/api/auth/verify-otp', verifyOtp);
// // 3. Error Handling (Must be last)
// app.use(notFound);
// app.use(errorHandler);

// export default app;


import express from 'express';
import cors from 'cors'; 
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { requestLogger } from './middleware/logger.js';

// Route Imports
import enquiryRoutes from './routes/enquiryRoutes.js';
import onboardRoutes from './routes/onboardRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();

// 1. Secure Production CORS Configuration
const whitelist = [
    'https://nutfullo.com',      // Your Live Site
    'https://www.nutfullo.com',  // WWW version
    'http://localhost:5173',     // Local Vite
    'http://localhost:3000',     // Local React
    'http://127.0.0.1:5173',
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error(`❌ CORS Blocked: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Apply CORS before any other middleware or routes
app.use(cors(corsOptions)); 

// Increase limit if you are uploading large documents/images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(requestLogger); 

// 2. API Routes
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/onboard', onboardRoutes); // This handles /api/onboard/add
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', authRoutes);
app.use('/api/cart', cartRoutes);

// 3. Error Handling (Must be LAST)
app.use(notFound);
app.use(errorHandler);

export default app;