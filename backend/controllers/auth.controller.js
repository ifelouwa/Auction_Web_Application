import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";

//Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

//Register a new user
export const registerUser = async (req, res) => {
  try {
    console.log("Registration request received:", req.body);
    const { name, username, email, password, phone, role } = req.body;

    //Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    //Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log("Username already exists:", username);
      return res.status(400).json({ message: "Username already exists" });
    }

    console.log("Creating new user with data:", { name, username, email, phone, role });
    //Create new user
    const newUser = await User.create({ name, username, email, password, phone, role });
    console.log("New user created:", newUser._id);

    //Send welcome email
    try {
      await sendEmail(
        newUser.email,
        "Welcome to The Golden Ball!",
        newUser.username,
        `Welcome to <b>The Golden Ball</b>, your trusted online auction platform.
        Your account has been created successfully. Explore exclusive listings,
        bid on premium items, and enjoy secure transactions.`,
        "https://thegoldenball.com" // replace with your actual hosted URL later
);

    } catch (emailErr) {
      console.log("Email failed:", emailErr.message);
      // Don't fail registration if email fails
    }

    //Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    //Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
