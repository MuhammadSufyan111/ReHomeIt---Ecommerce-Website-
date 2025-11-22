import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../utils/emailService.js"; 

dotenv.config();

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "30d" }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    try {
      await sendEmail(
        email,
        "Welcome to Our Platform 🎉",
        "welcomeEmail", 
        { name, email }
      );
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      return res.status(500).json({ message: "Failed to send welcome email. Try again later." });
    }

    const user = await User.create({ name, email, password, role });

    const token = createToken(user);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  res.json({ user: req.user });
};
