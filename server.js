const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ROUTE: Get all components
app.get('/api/components', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM components ORDER BY component_id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// ROUTE: Add a new component
app.post('/api/components', async (req, res) => {
    try {
        const { name, brand, price, wattage, stock } = req.body;
        
        // This SQL query inserts data and returns the new row
        const newComponent = await pool.query(
            "INSERT INTO components (name, brand, price, wattage, stock_qty) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [name, brand, price, wattage, stock]
        );

        res.json(newComponent.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
app.delete('/api/components/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM components WHERE component_id = $1", [id]);
        res.json("Component deleted successfully");
    } catch (err) {
        console.error(err.message);
    }
});
app.post('/api/build/finalize', async (req, res) => {
    try {
        const { ids } = req.body; // Array of IDs like [1, 2, 5]

        // SQL: Decrease stock_qty by 1 for all IDs in the list
        await pool.query(
            "UPDATE components SET stock_qty = stock_qty - 1 WHERE component_id = ANY($1)",
            [ids]
        );

        res.json({ message: "Stock updated" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
// server.js
app.post('/api/build/finalize', async (req, res) => {
    try {
        const { ids } = req.body;
        await pool.query(
            "UPDATE components SET stock_qty = stock_qty - 1 WHERE component_id = ANY($1)",
            [ids]
        );
        res.json({ message: "Inventory updated" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database Error");
    }
});
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});