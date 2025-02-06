require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
const { MongoClient } = require('mongodb')

const app = express();
const port = process.env.PORT || 3000;
const API_BASE_URL = "https://vital-backoffice-apps-production-8f97.up.railway.app/api"; // ✅ Kept for frontend use

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const mongo = new MongoClient('mongodb://mongo:ZcWRJuhejLSgxnNuMKQtoyJmRNiwbUFA@mongodb.railway.internal:27017')

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
    console.log("🔵 Received GET /api/appointments");
    try {
        const result = await pool.query("SELECT * FROM appointments ORDER BY date ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("🔴 Error fetching appointments:", error);
        res.status(500).json({ message: "Database error fetching appointments" });
    }
});

// ✅ Fetch Appointment by ID
app.get("/api/appointments/:id", async (req, res) => {
    console.log(`🔵 Received GET /api/appointments/${req.params.id}`);
    try {
        const result = await pool.query("SELECT * FROM appointments WHERE id = $1", [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("🔴 Error fetching appointment:", error);
        res.status(500).json({ message: "Database error fetching appointment" });
    }
});

// ✅ Create a New Appointment (POST)
app.post("/api/appointments", async (req, res) => { // ✅ Corrected Route Definition
    console.log("🔵 Received POST /api/appointments");
    console.log("📩 Incoming Request Body:", req.body);

    const { title, date, location, contactName, contactPhone, contactEmail, scheduledBy, notes } = req.body;

    // ✅ Validate Required Fields
    let missingFields = [];
    if (!title) missingFields.push("title");
    if (!date) missingFields.push("date");
    if (!scheduledBy) missingFields.push("scheduledBy");

    if (missingFields.length > 0) {
        console.warn("⚠️ Missing required fields:", missingFields);
        return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
    }

    try {
        const result = await pool.query(
            `INSERT INTO appointments (title, date, location, contact_name, contact_phone, contact_email, scheduled_by, notes) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [title, date, location, contactName, contactPhone, contactEmail, scheduledBy, notes || ""]
        );

        console.log("🟢 Appointment Added:", result.rows[0]); // ✅ Log inserted data
        return res.status(201).json({ message: "Appointment added successfully!", appointment: result.rows[0] });

    } catch (error) {
        console.error("🔴 Database Error:", error);
        return res.status(500).json({ message: "Database error adding appointment", error: error.message });
    }
});

// ----------------------------------
// ✅ EVENTS API ROUTES
// ----------------------------------

// ✅ Fetch All Events
app.get("/api/events", async (req, res) => {
    console.log("🔵 Received GET /api/events");
    try {
        const result = await pool.query("SELECT * FROM events ORDER BY date ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("🔴 Error fetching events:", error);
        res.status(500).json({ message: "Database error fetching events" });
    }
});

// ✅ Fetch Event by ID
app.get("/api/events/:id", async (req, res) => {
    console.log(`🔵 Received GET /api/events/${req.params.id}`);
    try {
        const result = await pool.query("SELECT * FROM events WHERE id = $1", [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("🔴 Error fetching event:", error);
        res.status(500).json({ message: "Database error fetching event" });
    }
});

// ✅ Fetch All Tasks (Supports Filters)
app.get("/api/tasks", async (req, res) => {
    console.log("🔵 Received GET /api/tasks");

    let { id, priority, status, category, deadline, limit = 25, page = 1 } = req.query;
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
        console.log("🔍 Executing Query:", query);
        console.log("📩 Query Parameters:", params);
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error("🔴 Database Error Fetching Tasks:", error);
        res.status(500).json({ message: "Database error fetching tasks" });
    }
});

app.get("/api/tasks/:id", async (req, res) => {
    console.log(`🔵 Received GET /api/tasks/${req.params.id}`);

    try {
        const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        let task = result.rows[0];
        task.deadline = task.deadline ? task.deadline.toISOString().split("T")[0] : "";

        res.json(task);
    } catch (error) {
        console.error("🔴 Error fetching task:", error);
        res.status(500).json({ message: "Database error fetching task" });
    }
});

app.put("/api/tasks/:id", async (req, res) => {
    console.log(`🔵 Received PUT /api/tasks/${req.params.id}`);
    console.log("📩 Incoming Request Body:", req.body);

    const { task_name, task_description, priority, deadline, assignee, status, category, progress } = req.body;

    // ✅ Validate Required Fields
    if (!task_name || !task_description || !priority || !status || !category) {
        console.warn("⚠️ Missing required fields.");
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        // ✅ Update Task in Database
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

        console.log("🟢 Task Updated Successfully:", result.rows[0]); // ✅ Log Updated Data
        res.json({ message: "Task updated successfully!", task: result.rows[0] });

    } catch (error) {
        console.error("🔴 Database Error Updating Task:", error);
        res.status(500).json({ message: "Database error updating task", error: error.message });
    }
});

app.post("/api/tasks", async (req, res) => {
    console.log("🔵 Received POST /api/tasks");
    console.log("📩 Incoming Request Body:", req.body);

    const { task_name, task_description, priority, deadline, assignee, status, category, progress } = req.body;

    // ✅ Validate Required Fields
    let missingFields = [];
    if (!task_name) missingFields.push("task_name");
    if (!task_description) missingFields.push("task_description");
    if (!priority) missingFields.push("priority");
    if (!status) missingFields.push("status");
    if (!category) missingFields.push("category");

    if (missingFields.length > 0) {
        console.warn("⚠️ Missing required fields:", missingFields);
        return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
    }

    try {
        // ✅ Insert New Task into Database
        const result = await pool.query(
            `INSERT INTO tasks (task_name, task_description, priority, deadline, assignee, status, category, progress) 
             VALUES ($1, $2, $3, CASE WHEN $4 = '' THEN NULL ELSE $4::DATE END, $5, $6, $7, $8) 
             RETURNING id`,
            [task_name, task_description, priority, deadline || null, assignee, status, category, progress || 0]
        );

        console.log("🟢 Task Added Successfully:", result.rows[0]); // ✅ Log Inserted Data
        res.status(201).json({ message: "Task added successfully!", task_id: result.rows[0].id });

    } catch (error) {
        console.error("🔴 Database Error Adding Task:", error);
        res.status(500).json({ message: "Database error adding task", error: error.message });
    }
});

// ✅ Fetch all customers
app.get("/api/customers", async (req, res) => {
    console.log("🔵 Fetching customers...");
    try {
        const result = await pool.query("SELECT * FROM customers ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("🔴 Error fetching customers:", error);
        res.status(500).json({ message: "Database error fetching customers" });
    }
});

// ✅ Fetch all interactions for a specific customer
app.get("/api/customers/:id/interactions", async (req, res) => {
    const customerId = req.params.id;
    console.log(`🔵 Fetching interactions for customer ${customerId}`);

    try {
        const result = await pool.query(
            "SELECT * FROM customer_interactions WHERE customer_id = $1 ORDER BY contact_date DESC",
            [customerId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("🔴 Error fetching interactions:", error);
        res.status(500).json({ message: "Database error fetching interactions" });
    }
});

app.post("/api/customers", async (req, res) => {
    console.log("🔵 Received POST /api/customers", req.body);

    const { first_name, last_name, business_email, phone_number, product_lines, notes } = req.body;

    if (!first_name || !last_name || !business_email) {
        console.warn("⚠️ Missing required fields:", { first_name, last_name, business_email });
        return res.status(400).json({ message: "First name, last name, and business email are required." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO customers (first_name, last_name, business_email, phone_number, product_lines, notes) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [first_name, last_name, business_email, phone_number, product_lines, notes || ""]
        );

        console.log("🟢 Customer Added:", result.rows[0]);
        return res.status(201).json({ message: "Customer added successfully!", customer: result.rows[0] });

    } catch (error) {
        console.error("🔴 Database Error:", error);
        return res.status(500).json({ message: "Database error adding customer", error: error.message });
    }
});



// Search Customers by Name, Email, or Product Line (Partial Match)
app.get("/api/customers", async (req, res) => {
    console.log("🔵 Received GET /api/customers with search query:", req.query.search);

    const searchQuery = req.query.search || "";

    try {
        const result = await pool.query(
            `SELECT * FROM customers WHERE 
                LOWER(first_name) LIKE LOWER($1) 
                OR LOWER(last_name) LIKE LOWER($1)
                OR LOWER(business_email) LIKE LOWER($1) 
                OR LOWER(product_lines) LIKE LOWER($1) 
            ORDER BY first_name ASC`,
            [`%${searchQuery}%`]
        );

        if (result.rows.length === 0) {
            return res.json({ message: "No customers found." });
        }

        res.json(result.rows);
    } catch (error) {
        console.error("🔴 Database Error:", error);
        res.status(500).json({ message: "Database error fetching customers", error: error.message });
    }
});


// Fetch a Customer by ID
app.get("/api/customers/:id", async (req, res) => {
    console.log(`🔵 Received GET /api/customers/${req.params.id}`);

    try {
        const result = await pool.query("SELECT * FROM customers WHERE id = $1", [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("🔴 Database Error:", error);
        res.status(500).json({ message: "Database error fetching customer", error: error.message });
    }
});


// ✅ Log a new interaction for a customer
app.post("/api/customers/:id/interactions", async (req, res) => {
    const customerId = req.params.id;
    const { contact_date, notes } = req.body;

    if (!notes) {
        return res.status(400).json({ message: "Interaction notes are required." });
    }

    try {
        const result = await pool.query(
            "INSERT INTO customer_interactions (customer_id, contact_date, notes) VALUES ($1, $2, $3) RETURNING *",
            [customerId, contact_date || new Date(), notes]
        );
        res.status(201).json({ message: "Interaction logged successfully!", interaction: result.rows[0] });

    } catch (error) {
        console.error("🔴 Database Error Adding Interaction:", error);
        res.status(500).json({ message: "Database error adding interaction" });
    }
});

// ✅ FUNCTION TO OPEN CUSTOMER DETAILS IN A NEW PAGE
function fetchCustomer(customerId) {
    console.log(`🔵 Opening customer details page for ID: ${customerId}`);
    window.open(`customer.html?id=${customerId}`, "_blank"); // Opens customer.html instead of raw JSON
}


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
