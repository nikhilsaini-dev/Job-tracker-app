import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "mysecretkey";

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// FORGOT PASSWORD
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 12);
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // 3️⃣ Build production reset link
    const link = ${process.env.CLIENT_URL}/reset-password/${resetToken};

    // 4️⃣ Use deploy-ready transporter (host/port)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 5️⃣ Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${link}">${link}</a>
      `
    });

    console.log("RESET LINK:", link); // test ke liye console
    res.json({ message: "Reset link sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;