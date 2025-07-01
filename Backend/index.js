require('dotenv').config(); // Loads .env

const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const router = require('./Routes/router');

const app = express();
const port = process.env.PORT || 3001;

// ✅ Connect to MongoDB
connectToMongo();

// ✅ Enable CORS for frontend domains
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://inventory-management-system7.onrender.com' // your frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// ✅ Parse JSON
app.use(express.json());

// ✅ Route prefix
app.use('./', router);

// ✅ Default route to test
app.get('/', (req, res) => {
  res.send('Backend running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
