require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;
const API_BASE_URL = "https://vital-backoffice-apps-production-8f97.up.railway.app/api"; // ✅ Kept for frontend use

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// ----------------------------------
// ✅ APPOINTMENTS API ROUTES
// ----------------------------------

// ✅ Fetch All Appointments
app.get("/api/appointments", async (req, res) => {
    console.log("Received GET /api/appointments");
    try {
        const result = await pool.query("SELECT * FROM appointments ORDER BY date ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Database error fetching appointments" });
    }
});

// ✅ Fetch Appointment by ID
app.get("/api/appointments/:id", async (req, res) => {
    console.log(`Received GET /api/appointments/${req.params.id}`);
    try {
        const result = await pool.query("SELECT * FROM appointments WHERE id = $1", [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching appointment:", error);
        res.status(500).json({ message: "Database error fetching appointment" });
    }
});

// ✅ Create a New Appointment (POST)
app.post("/api/appointments", async (req, res) => {
    console.log("Received POST /api/appointments");

    const { title, date, location, notes, scheduledBy } = req.body;

    if (!title || !date || !scheduledBy) {
        return res.status(400).json({ message: "Missing required fields: title, date, scheduledBy" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO appointments (title, date, location, notes, scheduledBy) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id, title, date`,
            [title, date, location, notes, scheduledBy]
        );

        res.status(201).json({ 
            message: "Appointment created successfully!", 
            appointment: result.rows[0] 
        });

    } catch (error) {
        console.error("Error adding appointment:", error);
        res.status(500).json({ message: "Database error adding appointment" });
    }
});

// ----------------------------------
// ✅ EVENTS API ROUTES
// ----------------------------------

// ✅ Fetch All Events
app.get("/api/events", async (req, res) => {
    console.log("Received GET /api/events");
    try {
        const result = await pool.query("SELECT * FROM events ORDER BY date ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Database error fetching events" });
    }
});

// ✅ Fetch Event by ID
app.get("/api/events/:id", async (req, res) => {
    console.log(`Received GET /api/events/${req.params.id}`);
    try {
        const result = await pool.query("SELECT * FROM events WHERE id = $1", [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Database error fetching event" });
    }
});

// ----------------------------------
// ✅ Catch-All Route for Invalid API Requests
// ----------------------------------
app.all("*", (req, res) => {
  console.warn("Invalid API route accessed:", req.path);
  res.status(404).json({ error: "Invalid API route" });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
