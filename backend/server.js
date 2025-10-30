import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import bidRoutes from "./routes/bid.route.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bids", bidRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to The Golden Ball API");
});

const PORT = process.env.PORT || 5000;

// for local testing
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// for Vercel deployment
export default app;
