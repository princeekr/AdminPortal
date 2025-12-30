import express from 'express';
import cors from 'cors';

import connectDB from '../backend_admin/config/db.js';
import adminRoutes from '../backend_admin/routes/admin.js';

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

// Connect to DB on every request (cached)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({ error: "Database connection failed" });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: "Backend working 🚀" });
});

app.use('/api', adminRoutes);

export default app;
