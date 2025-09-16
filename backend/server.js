require('dotenv').config();
const express = require('express');
const pool = require('./src/config/db');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // أسمح للفرونت إند فقط
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true // إذا تحتاج الكوكيز أو توكنات الجلسة
}));


// Test DB connection
pool.connect()
  .then(() => console.log("Connected to Render DB!"))
  .catch(err => console.error("Connection error", err.stack));

// Routes
const categoryRoutes = require('./src/modules/category/categoryRoutes');
app.use('/categories', categoryRoutes);

const productRoutes = require('./src/modules/product/productRoutes');
app.use('/api/products', productRoutes);

const vendorRoutes = require('./src/modules/vendor/vendorRoutes');
app.use('/stores', vendorRoutes);

const deliveryRoutes = require("./src/modules/delivery/deliveryRoutes");
app.use("/delivery", deliveryRoutes);

const authRoutes = require('./src/modules/auth/authRoutes');
app.use('/api/auth', authRoutes);

const adminRoutes = require('./src/modules/admin/adminRoutes');
app.use('/api/admin', adminRoutes);

const paymentRoutes = require("./src/modules/payment/paymentRoutes");
app.use("/api/payment", paymentRoutes);

const notificationRoutes = require("./src/infrastructure/notification/notificationRoutes");
app.use("/api", notificationRoutes);

const userRoutes = require("./src/modules/user/userRoutes");
app.use("/api/users", userRoutes);
// Server Listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));