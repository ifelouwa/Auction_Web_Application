import express from "express";
import protect, { adminOnly } from "../middleware/authMiddleware.js";
import { 
  createProduct, 
  deleteProduct, 
  getProducts, 
  updateProduct, 
  getProductById, 
} from "../controllers/product.controller.js";

const router = express.Router();

//Public
router.get("/", getProducts);
router.get("/:id", getProductById);

//Protected
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/admin/:id", protect, adminOnly, deleteProduct);
router.delete("/:id", protect, deleteProduct);


export default router;