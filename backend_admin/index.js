import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

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
app.use("/api", adminRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Dynamic port for cloud deployment
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;
