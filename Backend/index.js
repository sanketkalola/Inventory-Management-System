require('dotenv').config();  // load env variables

const connectToMongo = require('./db');
connectToMongo();

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

const cors = require('cors');
const router = require('./Routes/router');

app.use(cors({
  origin: [
    'http://localhost:3000',                             // ← your React dev server
    'https://inventory-management-system7.onrender.com'  // ← your deployed frontend, if needed
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use('/api', router); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
