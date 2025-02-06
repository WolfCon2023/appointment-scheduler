require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { MongoClient } = require('mongodb')

const app = express();
const port = process.env.PORT || 3000;
const API_BASE_URL = "https://vital-backoffice-apps-production-8f97.up.railway.app/api"; // ✅ Kept for frontend use

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const mongo = new MongoClient(process.env.MONGO_URL)
const db = mongo.db('VitalDB')

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
        // Get all appointments
        const data = await db.collection('appointments').find().toArray()
        res.json(data)
    } catch (error) {
        console.error("🔴 Error fetching appointments:", error);
        res.status(500).json({ message: "Database error fetching appointments" });
    }
});

// ✅ Fetch Appointment by ID
app.get("/api/appointments/:id", async (req, res) => {
    console.log(`🔵 Received GET /api/appointments/${req.params.id}`);
    try {
    } catch (error) {
        console.error("🔴 Error fetching appointment:", error);
        res.status(500).json({ message: "Database error fetching appointment" });
    }
});

// ✅ Create a New Appointment (POST)
app.post("/api/appointments", async (req, res) => { // ✅ Corrected Route Definition
    console.log("🔵 Received POST /api/appointments");
    console.log("📩 Incoming Request Body:", req.body);


    try {
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
    } catch (error) {
        console.error("🔴 Error fetching events:", error);
        res.status(500).json({ message: "Database error fetching events" });
    }
});

// ✅ Fetch Event by ID
app.get("/api/events/:id", async (req, res) => {
    console.log(`🔵 Received GET /api/events/${req.params.id}`);
    try {
    } catch (error) {
        console.error("🔴 Error fetching event:", error);
        res.status(500).json({ message: "Database error fetching event" });
    }
});

// ✅ Fetch All Tasks (Supports Filters)
app.get("/api/tasks", async (req, res) => {
    console.log("🔵 Received GET /api/tasks");


    try {
    } catch (error) {
        console.error("🔴 Database Error Fetching Tasks:", error);
        res.status(500).json({ message: "Database error fetching tasks" });
    }
});

app.get("/api/tasks/:id", async (req, res) => {
    console.log(`🔵 Received GET /api/tasks/${req.params.id}`);

    try {
    } catch (error) {
        console.error("🔴 Error fetching task:", error);
        res.status(500).json({ message: "Database error fetching task" });
    }
});

app.put("/api/tasks/:id", async (req, res) => {
    console.log(`🔵 Received PUT /api/tasks/${req.params.id}`);
    console.log("📩 Incoming Request Body:", req.body);


    try {
    } catch (error) {
        console.error("🔴 Database Error Updating Task:", error);
        res.status(500).json({ message: "Database error updating task", error: error.message });
    }
});

app.post("/api/tasks", async (req, res) => {
    console.log("🔵 Received POST /api/tasks");
    console.log("📩 Incoming Request Body:", req.body);


    try {

    } catch (error) {
        console.error("🔴 Database Error Adding Task:", error);
        res.status(500).json({ message: "Database error adding task", error: error.message });
    }
});

// ✅ Fetch all customers
app.get("/api/customers", async (req, res) => {
    console.log("🔵 Fetching customers...");
    try {
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
    } catch (error) {
        console.error("🔴 Error fetching interactions:", error);
        res.status(500).json({ message: "Database error fetching interactions" });
    }
});

app.post("/api/customers", async (req, res) => {
    console.log("🔵 Received POST /api/customers", req.body);

    const { first_name, last_name, business_email, phone_number, product_lines, notes } = req.body;


    try {
    } catch (error) {
        console.error("🔴 Database Error:", error);
        return res.status(500).json({ message: "Database error adding customer", error: error.message });
    }
});



// Search Customers by Name, Email, or Product Line (Partial Match)
app.get("/api/customers", async (req, res) => {
    console.log("🔵 Received GET /api/customers with search query:", req.query.search);

    try {
    } catch (error) {
        console.error("🔴 Database Error:", error);
        res.status(500).json({ message: "Database error fetching customers", error: error.message });
    }
});


// Fetch a Customer by ID
app.get("/api/customers/:id", async (req, res) => {
    console.log(`🔵 Received GET /api/customers/${req.params.id}`);

    try {
    } catch (error) {
        console.error("🔴 Database Error:", error);
        res.status(500).json({ message: "Database error fetching customer", error: error.message });
    }
});


// ✅ Log a new interaction for a customer
app.post("/api/customers/:id/interactions", async (req, res) => {
    try {

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
