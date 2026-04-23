import express from 'express';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { requestLogger } from './middleware/logger.js';
import cookieParser from 'cookie-parser';


// Route Imports
import enquiryRoutes from './routes/enquiryRoutes.js';
import onboardRoutes from './routes/onboardRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from "./routes/userRoutes.js";


const app = express();
app.use(cookieParser());


const whitelist = [
    'https://nutfullo.com',           // Main Site
    'https://www.nutfullo.com',       // WWW version
    'https://admin.nutfullo.com',     // NEXT.JS DASHBOARD (Future)
    'http://localhost:5173',          // Local Vite (Website)
    'http://localhost:3000',          // Local Next.js (Dashboard)
    'http://127.0.0.1:5173',
    'https://api.nutfullo.com',
    'https://main.dgmsl5sfhz7tb.amplifyapp.com',
    'https://dashboard.nutfullo.com'
];

const corsOptions = {
    origin: function (origin, callback) {
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
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use(requestLogger);

app.get('/api/health', (req, res) => res.status(200).json({ status: 'UP' }));

app.use("/api/users", userRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/onboard', onboardRoutes); // Matches /api/onboard/add
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', authRoutes);
app.use('/api/cart', cartRoutes);

// 3. Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;