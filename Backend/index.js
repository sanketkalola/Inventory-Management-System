require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const productsRouter = require('./Routes/router');

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
connectToMongo();

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://inventory-management-system-jt6k.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Parse JSON requests
app.use(express.json());

// Add debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// MOUNT the products router on /api
app.use('/api', productsRouter);

// Test route
app.get('/', (req, res) => {
  res.send('Backend running');
});

// Add a catch-all route for debugging
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    availableRoutes: [
      'GET /',
      'GET /api/products',
      'POST /api/products/insertproduct',
      'GET /api/products/:id',
      'PUT /api/products/updateproduct/:id',
      'DELETE /api/products/deleteproduct/:id'
    ]
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});