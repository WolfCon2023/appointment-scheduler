require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;
const API_BASE_URL = "/api";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Health Check Route
app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// ----------------------------------
// APPOINTMENTS API ROUTES
// ----------------------------------

// Fetch All Appointments
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

// Add an Appointment
app.post(`${API_BASE_URL}/appointments`, async (req, res) => {
  console.log("Received POST /api/appointments", req.body);

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
    console.error("Error adding appointment:", error);
    res.status(500).json({ message: "Database error adding appointment" });
  }
});

// ----------------------------------
// EVENTS API ROUTES
// ----------------------------------

// Fetch All Events
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

// Add an Event
app.post(`${API_BASE_URL}/events`, async (req, res) => {
  console.log("Received POST /api/events", req.body);

  const { title, date, location, description, createdBy } = req.body;
  
  if (!title || !date || !createdBy) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO events (title, date, location, description, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, date, location, description, createdBy]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ message: "Database error adding event" });
  }
});

// ----------------------------------
// TASKS API ROUTES
// ----------------------------------

// ✅ Fetch All Tasks (Supports multiple statuses)
app.get(`${API_BASE_URL}/tasks`, async (req, res) => {
    console.log("Received GET /api/tasks");

    const { id, priority, status, category, deadline, limit = 25, page = 1 } = req.query;
    let query = "SELECT * FROM tasks";
    let conditions = [];
    let params = [];

    if (id) {
        conditions.push(`id = $${params.length + 1}`);
        params.push(id);
    }
    if (priority) {
        conditions.push(`priority = $${params.length + 1}`);
        params.push(priority);
    }
    if (status) {
        let statusList = status.split(",").map(s => s.trim());
        conditions.push(`status = ANY($${params.length + 1})`);
        params.push(statusList);
    }
    if (category) {
        conditions.push(`category = $${params.length + 1}`);
        params.push(category);
    }
    if (deadline) {
        conditions.push(`deadline = $${params.length + 1}`);
        params.push(deadline);
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    query += ` ORDER BY deadline ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit);
    params.push((page - 1) * limit);

    try {
        const result = await pool.query(query, params);
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

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Database error fetching task" });
    }
});

// ✅ Add a Task
app.post(`${API_BASE_URL}/tasks`, async (req, res) => {
    console.log("Received POST /api/tasks");

    const { task_name, task_description, priority, deadline, assignee, status, category, progress } = req.body;

    if (!task_name || !task_description || !deadline || !assignee) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const result = await pool.query(
            "INSERT INTO tasks (task_name, task_description, priority, deadline, assignee, status, category, progress) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, task_name",
            [task_name, task_description, priority, deadline, assignee, status, category, progress]
        );

        res.status(201).json({ 
            message: "Task added successfully!", 
            task_id: result.rows[0].id,
            task_name: result.rows[0].task_name
        });

    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Database error adding task" });
    }
});

// ----------------------------------
// Catch-All Route for Invalid API Requests
// ----------------------------------
app.all("*", (req, res) => {
  console.warn("Invalid API route accessed:", req.path);
  res.status(404).json({ error: "Invalid API route" });
});

// ----------------------------------
// Start Server
// ----------------------------------
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
