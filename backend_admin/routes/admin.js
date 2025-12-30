import express from "express";
import Registration from "../models/Registration.js";

const router = express.Router();

router.get("/registrations", async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ created_at: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
});

export default router;
