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

//Put 
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.user.toString() !== req.userId)
      return res.status(401).json({ message: "Unauthorized" });

    job.company = req.body.company;
    job.role = req.body.role;
    job.status = req.body.status;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;