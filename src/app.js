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

const app = express();

// 1. Secure Production CORS Configuration
const whitelist = [
    'https://nutfullo.com',      // Your Live Amplify Site
    'https://www.nutfullo.com',
    'http://localhost:5173',     // Your Local Vite Development
    'http://localhost:3000'      // Your Local React Development
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by Nutfullo Security (CORS)'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};

// Apply Security Middlewares
app.use(cors(corsOptions)); 

// Limit JSON and URL-Encoded payloads to 2MB
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

app.use(requestLogger); 

// 2. API Routes
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/onboard', onboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', authRoutes);

// app.post('/api/auth/verify-otp', verifyOtp);
// 3. Error Handling (Must be last)
app.use(notFound);
app.use(errorHandler);

export default app;