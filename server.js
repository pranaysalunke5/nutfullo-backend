const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
// app.use(cors()); // Allows your React frontend to talk to this backend
app.use(cors({
  origin: 'http://localhost:5173', // Allow your Vite dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json()); // Parses incoming JSON data

// Routes
app.use('/api/enquiries', require('./routes/enquiryRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in 2026 mode on port ${PORT}`);
});