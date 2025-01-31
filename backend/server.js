require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 80;  // Ensure it runs on the correct port

// ✅ PostgreSQL Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Input Validation Middleware (for POST requests)
const validateAppointmentData = (data) => {
  const { title, date, location, contactName, contactPhone, contactEmail, scheduledBy, notes } = data;
  if (!title || !date || !contactName || !contactPhone) {
    return { valid: false, message: "Required fields are missing" };
  }
  // Additional checks can be added here for specific fields (e.g., valid email, valid phone number format)
  return { valid: true };
};

// ✅ API Routes (DEFINE BEFORE SERVING STATIC FILES)
app.post("/appointments", async (req, res) => {
  const { title, date, location, contactName, contactPhone, contactEmail, scheduledBy, notes } = req.body;

  // Input Validation
  const validation = validateAppointmentData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    const result = await pool.query(
      "INSERT INTO appointments (title, date, location, contact_name, contact_phone, contact_email, scheduled_by, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [title, date, location, contactName, contactPhone, contactEmail, scheduledBy, notes]
    );
    res.status(201).json({ message: 'Appointment added successfully', appointment: result.rows[0] });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message || "Database error" });
  }
});

app.get("/appointments", async (req, res) => {
  const limit = req.query.limit || 10; // Default to 10 results per page
  const offset = req.query.page ? (req.query.page - 1) * limit : 0;

  try {
    const result = await pool.query(
      "SELECT * FROM appointments ORDER BY date ASC LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message || "Database error" });
  }
});

// ✅ Serve static frontend files (Only after API routes)
app.use(express.static("public"));

// ✅ Catch-All Route (Redirect all unknown requests to index.html)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start Express Server
app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});
