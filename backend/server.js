const pool = require('./src/config/db'); 

pool.connect()
  .then(() => console.log("Connected to Render DB!"))
  .catch(err => console.error("Connection error", err.stack));

const express = require('express');
const app = express();

const product = require ("./src/modules/product/productRoutes");

app.use(express.json());
app.use("/api", product);

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users LIMIT 5');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
