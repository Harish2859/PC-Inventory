const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',           // Your pgAdmin username (usually postgres)
  host: 'localhost',
  database: 'pc_inventory_db', // The name of the database you just created
  password: '1234',   // Your pgAdmin password
  port: 5432,
});

module.exports = pool;