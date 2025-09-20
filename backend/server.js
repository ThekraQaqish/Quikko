require('dotenv').config();
const express = require('express');
const pool = require('./src/config/db');
const app = express();
app.use(express.json());
const { swaggerUi, specs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// const cors = require('cors');
// app.use(cors({
//   origin: 'http://localhost:5173', 
//   methods: ['GET','POST','PUT','DELETE'],
//   credentials: true 
// }));


// Test DB connection
pool.connect()
  .then(() => console.log("Connected to Render DB!"))
  .catch(err => console.error("Connection error", err.stack));

// Routes
const categoryRoutes = require('./src/modules/category/categoryRoutes');
app.use('/api/categories', categoryRoutes);

const vendorRoutes = require("./src/modules/vendor/vendorRoutes");
app.use("/api/vendor", vendorRoutes);

const deliveryRoutes = require("./src/modules/delivery/deliveryRoutes");
app.use("/api/delivery", deliveryRoutes);

const authRoutes = require('./src/modules/auth/authRoutes');
app.use('/api/auth', authRoutes);

const adminRoutes = require('./src/modules/admin/adminRoutes');
app.use('/api/admin', adminRoutes);

const paymentRoutes = require("./src/modules/payment/paymentRoutes");
app.use("/api/payment", paymentRoutes);

const notificationRoutes = require("./src/infrastructure/notification/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

const userRoutes = require("./src/modules/user/userRoutes");
app.use("/api/users", userRoutes);

const cmsRoutes = require('./src/modules/cms/cmsRoutes');
app.use('/api/cms', cmsRoutes);

const customerRoutes = require('./src/modules/customer/customerRoutes');
app.use('/api/customers', customerRoutes);

const chatRoutes = require('./src/modules/chat/chatRoutes');
app.use('/api/chat', chatRoutes);


const productsRoutes = require('./src/modules/product/productRoutes');
app.use('/api/products',productsRoutes)

const orderRoutes = require('./src/modules/order/orderRoutes');
app.use('/api/orders',orderRoutes);


const reviewRoutes = require('./src/modules/review/reviewRoutes');
app.use('/api/reviews',reviewRoutes);


// Server Listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));