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
    'https://inventory-management-system7.onrender.com',  // Production
    'http://localhost:3000',  // Local development
    'http://127.0.0.1:3000'   // Alternative local
  ], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/api', router); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
