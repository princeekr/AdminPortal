import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: "Backend working 🚀" });
});

// Add your other routes here, e.g.:
// import adminRoutes from '../backend_admin/routes/admin.js';
// app.use('/api', adminRoutes);
// For now, let's keep it minimal to satisfy the "crash-free" requirement first.

export default app;
