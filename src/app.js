import express from 'express';
import cors from 'cors'; // 1. Import CORS
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { requestLogger } from './middleware/logger.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import onboardRoutes from './routes/onboardRoutes.js';

const app = express();

// 1. Standard Middlewares
app.use(cors()); // 2. Add this BEFORE routes to allow frontend access
app.use(express.json());
app.use(requestLogger); 

// 2. Your Routes
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/onboard', onboardRoutes);

// 3. Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;