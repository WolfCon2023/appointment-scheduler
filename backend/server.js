require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;
const API_BASE_URL = "https://vital-backoffice-apps-production.up.railway.app/api";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api", require("./routes/appointments"));

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Route to serve index.html by default
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
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
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
  }
});

// Use Railway-assigned PORT
const PORT = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
