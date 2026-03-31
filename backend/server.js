import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin:[ 
    "http://localhost:5173",
    "https://job-tracker-app-mjkm.vercel.app"

  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));