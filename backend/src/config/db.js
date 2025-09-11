const { Pool } = require('pg');

const pool = new Pool({
  user: 'qwikkodb_user',
  host: 'dpg-d31g920dl3ps73eqodcg-a.oregon-postgres.render.com',
  database: 'qwikkodb',
  password: 'o5eY7dm9BJd8T0rXh8xkhEwl2V2QdOxf',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;

