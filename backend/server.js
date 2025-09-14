require('dotenv').config();
const express = require('express');
const pool = require('./src/config/db');
const authRoutes = require('./src/modules/auth/authRoutes');

const app = express();
app.use(express.json());

// Test DB connection
pool.connect()
  .then(() => console.log("Connected to Render DB!"))
  .catch(err => console.error("Connection error", err.stack));

// Routes
app.use('/api/auth', authRoutes);


const adminRoutes = require('./src/modules/admin/adminRoutes');
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
