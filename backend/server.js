require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;
const API_BASE_URL = "/api"; // API Base Path

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ Serve index.html for root route (Temporary Debugging Response)
app.get("/", (req, res) => {
    res.send("Backend API is running!");
});

// ✅ PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ API Route to Save an Appointment
app.post("/api/appointments", async (req, res) => {
  console.log("Received POST /api/appointments");

  const { title, date, location, contactName, contactPhone, contactEmail, scheduledBy, notes } = req.body;
  
  if (!title || !date || !location || !contactName || !contactPhone || !contactEmail || !scheduledBy) {
      return res.status(400).json({ error: "Missing required fields." });
  }

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

// ✅ API Route to Fetch Appointments
app.get("/api/appointments", async (req, res) => {
  console.log("Received GET /api/appointments");

  try {
    const result = await pool.query("SELECT * FROM appointments ORDER BY date ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Catch-All Route to Serve `index.html`
app.get("*", (req, res) => {
  res.status(404).send("404 - Not Found: Invalid API route");
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
