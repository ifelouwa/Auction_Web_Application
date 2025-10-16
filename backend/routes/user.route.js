import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { getAllUsers, getUserById, deleteUser } from "../controllers/user.controller.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

//AUTH Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

//Admin: get all users
router.get("/", protect, adminOnly, getAllUsers);

//Logged-in user or admin: get one user
router.get("/:id", protect, getUserById);

//Admin: delete user
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
