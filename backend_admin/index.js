require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

/**
 * ✅ CORS CONFIG
 * - Allows frontend to be deployed later
 * - Works for local + deployed frontend
 * - Can be restricted after deployment
 */
app.use(cors({
  origin: true, // 👈 IMPORTANT (handles deploy order problem)
  methods: ["GET", "POST"],
  credentials: true
}));

// Parse JSON request body
app.use(express.json());

// Connect MongoDB
connectDB();

// API Routes
app.use("/api", registrationRoutes);

// Dynamic port for cloud deployment
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
