import express from 'express';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { requestLogger } from './middleware/logger.js';
import enquiryRoutes from './routes/enquiryRoutes.js';

const app = express();

// 1. Standard Middlewares
app.use(express.json());
app.use(requestLogger); // Your custom logger

// 2. Your Routes
app.use('/api/enquiries', enquiryRoutes);

// 3. Error Handling Middlewares (Must be at the end!)
app.use(notFound);
app.use(errorHandler);

export default app;