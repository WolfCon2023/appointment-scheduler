const express = require("express");
const path = require("path");
const app = express();

// Serve static frontend files
app.use(express.static("public"));

// API Route (Backend Service)
app.get("/api/appointments", async (req, res) => {
    res.json([{ id: 1, title: "Meeting with Client", date: "2025-02-01" }]);
});

// Default Route (Serve index.html)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
