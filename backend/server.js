import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import bidRoutes from "./routes/bid.route.js";

dotenv.config();

// Connect to MongoDB
connectDB();
console.log("DB connect called");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
console.log("Setting routes");
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bids", bidRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to The Golden Ball API");
});

const PORT = process.env.PORT || 5000;
console.log(`PORT from env: ${process.env.PORT}, using ${PORT}`);

// for local testing
console.log("Before listen");
console.log(`NODE_ENV is ${process.env.NODE_ENV}`);
if (true) { // for local testing
  console.log(`Attempting to listen on port ${PORT}`);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  console.log(`Starting server on port ${PORT}`);
}

// for Vercel deployment
export default app;
