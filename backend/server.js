require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;
const API_BASE_URL = "https://vital-backoffice-apps-production-8f97.up.railway.app/api"; // ✅ Kept the original API_BASE_URL

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
// ✅ TASKS API ROUTES
// ----------------------------------

// ✅ Fetch All Tasks
app.get(`${API_BASE_URL}/tasks`, async (req, res) => {
    console.log("Received GET /api/tasks");

    try {
        const result = await pool.query("SELECT * FROM tasks ORDER BY deadline ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Database error fetching tasks" });
    }
});

// ✅ Fetch Task Details by ID
app.get(`${API_BASE_URL}/tasks/:id`, async (req, res) => {
    console.log(`Received GET /api/tasks/${req.params.id}`);

    try {
        const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        let task = result.rows[0];
        task.deadline = task.deadline ? task.deadline.toISOString().split("T")[0] : ""; // ✅ Convert NULL to empty string

        res.json(task);
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Database error fetching task" });
    }
});

// ✅ Update Task by ID (Handles NULL deadline)
app.put(`${API_BASE_URL}/tasks/:id`, async (req, res) => {
    console.log(`Received PUT /api/tasks/${req.params.id}`);

    const { task_name, task_description, priority, deadline, assignee, status, category, progress } = req.body;

    if (!task_name || !task_description || !priority || !status || !category) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const result = await pool.query(
            `UPDATE tasks 
             SET task_name = $1, 
                 task_description = $2, 
                 priority = $3, 
                 deadline = CASE WHEN $4 = '' THEN NULL ELSE $4::DATE END, 
                 assignee = $5, 
                 status = $6, 
                 category = $7, 
                 progress = $8 
             WHERE id = $9 RETURNING *`,
            [task_name, task_description, priority, deadline || null, assignee, status, category, progress, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task updated successfully!", task: result.rows[0] });

    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: `Database error updating task: ${error.message}` });
    }
});

// ✅ Fetch All Appointments
app.get(`${API_BASE_URL}/appointments`, async (req, res) => {
    console.log("Received GET /api/appointments");
    try {
        const result = await pool.query("SELECT * FROM appointments ORDER BY date ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Database error fetching appointments" });
    }
});

// ✅ Fetch All Events
app.get(`${API_BASE_URL}/events`, async (req, res) => {
    console.log("Received GET /api/events");
    try {
        const result = await pool.query("SELECT * FROM events ORDER BY date ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Database error fetching events" });
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
