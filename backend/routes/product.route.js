import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { 
  createProduct, 
  deleteProduct, 
  getProducts, 
  getProductById,
  updateProduct,
  placeBid,
  getBidsForProduct
} from "../controllers/product.controller.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:id/bids", getBidsForProduct);

// Protected routes
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.post("/:id/bid", protect, placeBid);

export default router;




