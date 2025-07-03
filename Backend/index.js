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

// MOUNT the products router on /api/products
app.use('/api/products', productsRouter);

// Test route
app.get('/', (req, res) => {
  res.send('Backend running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
