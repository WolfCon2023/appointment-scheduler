require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 80;  // Use Railway's assigned port

// ✅ PostgreSQL Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serves frontend

// ✅ API Route to Save an Appointment (POST)
app.post("/api/appointments", async (req, res) => {
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

// ✅ API Route to Fetch All Appointments (GET)
app.get("/api/appointments", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM appointments ORDER BY date ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Serve index.html for non-API routes (Prevents 404 for frontend routes)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Catch-All Route: Redirect unknown requests to frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start Express Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
