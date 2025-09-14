require('dotenv').config();
const express = require('express');
const pool = require('./src/config/db');
const authRoutes = require('./src/modules/auth/authRoutes');
const adminRoutes = require('./src/modules/admin/adminRoutes');
const productRoutes = require('./src/modules/product/productRoutes');

const app = express();
app.use(express.json());

// Test DB connection
pool.connect()
  .then(() => console.log("Connected to Render DB!"))
  .catch(err => console.error("Connection error", err.stack));


const deliveryRoutes = require("./src/modules/delivery/deliveryRoutes");

app.use("/delivery", deliveryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
