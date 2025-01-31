require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// API Route to Save an Appointment
app.post("/appointments", async (req, res) => {
  const { title, date, location, contactName, contactPhone, contactEmail, scheduledBy, notes } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO appointments (title, date, location, contact_name, contact_phone, contact_email, scheduled_by, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [title, date, location, contactName, contactPhone, contactEmail, scheduledBy, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// API Route to Fetch Appointments
app.get("/appointments", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM appointments ORDER BY date ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
