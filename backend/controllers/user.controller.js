import mongoose from "mongoose";
import User from "../models/user.model.js";

//Get all users admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get user by ID self for admin
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    //Validate ID before using it
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    //Authorization check self or admin
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    //Fetch the user
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Delete a user admin only
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    //Validate ID before using it
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};