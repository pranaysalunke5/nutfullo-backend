// import express from 'express';
// import cors from 'cors'; // 1. Import CORS
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// import { requestLogger } from './middleware/logger.js';
// import enquiryRoutes from './routes/enquiryRoutes.js';
// import onboardRoutes from './routes/onboardRoutes.js';
// import productRoutes from './routes/productRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';

// const app = express();

// // 1. Standard Middlewares
// app.use(cors()); // 2. Add this BEFORE routes to allow frontend access
// app.use(express.json());
// app.use(requestLogger); 


// // 2. Your Routes
// app.use('/api/enquiries', enquiryRoutes);
// app.use('/api/onboard', onboardRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);

// // 3. Error Handling Middlewares
// app.use(notFound);
// app.use(errorHandler);

// export default app;

import express from 'express';
import cors from 'cors'; 
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { requestLogger } from './middleware/logger.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import onboardRoutes from './routes/onboardRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// 1. Production CORS Configuration
const corsOptions = {
    origin: ['https://nutfullo.com', 'http://localhost:3000'], // Allow Amplify and local testing
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions)); 
app.use(express.json());
app.use(requestLogger); 

// 2. Routes
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/onboard', onboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 3. Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;