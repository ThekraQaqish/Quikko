const pool = require('./src/config/db'); 

pool.connect()
  .then(() => console.log("Connected to Render DB!"))
  .catch(err => console.error("Connection error", err.stack));

const express = require('express');
const app = express();
app.use(express.json());


const deliveryRoutes = require("./src/modules/delivery/deliveryRoutes");

app.use("/delivery", deliveryRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
