const pool = require('./src/config/db'); 

pool.connect()
  .then(() => console.log("Connected to Render DB!"))
  .catch(err => console.error("Connection error", err.stack));

const express = require('express');
const app = express();

const product = require ("./src/modules/product/productRoutes");

app.use(express.json());
app.use("/api/products", product);


app.listen(3000, () => console.log('Server running on port 3000'));
