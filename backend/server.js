require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const API_BASE_URL = "https://vital-backoffice-apps-production.up.railway.app/api";

// ✅ PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ Serve index.html for non-API routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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

// ✅ Catch-All Route (Redirect all unknown routes to frontend)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
