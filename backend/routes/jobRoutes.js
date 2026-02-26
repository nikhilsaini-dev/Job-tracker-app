import express from "express";
import Job from "../models/Job.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET all jobs for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new job
router.post("/", verifyToken, async (req, res) => {
  try {
    const job = new Job({ ...req.body, user: req.userId });
    const savedJob = await job.save();
    res.json(savedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE job
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;