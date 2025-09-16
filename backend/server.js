require('dotenv').config();
const express = require('express');
const pool = require('./src/config/db');
const app = express();
app.use(express.json());

// Test DB connection
pool.connect()
  .then(() => console.log("Connected to Render DB!"))
  .catch(err => console.error("Connection error", err.stack));

const categoryRoutes = require('./src/modules/category/categoryRoutes');
app.use('/categories', categoryRoutes);

const vendorRoutes = require('./src/modules/vendor/vendorRoutes');
app.use('/stores', vendorRoutes);

const deliveryRoutes = require("./src/modules/delivery/deliveryRoutes");
app.use("/delivery", deliveryRoutes);

const authRoutes = require('./src/modules/auth/authRoutes');
app.use('/api/auth', authRoutes);

const adminRoutes = require('./src/modules/admin/adminRoutes');
app.use('/api/admin', adminRoutes);

const productRoutes = require('./src/modules/product/productRoutes');
app.use('/api/products', productRoutes);

const orderRoutes = require('./src/modules/order/orderRoutes');
app.use('/api/orders', orderRoutes);

const reviewRoutes = require('./src/modules/review/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

const customerRoutes = require('./src/modules/customer/customerRoutes');
app.use('/api/customer', customerRoutes);

const paymentRoutes = require("./src/modules/payment/paymentRoutes");
app.use("/api/payment", paymentRoutes);

//Server Listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
