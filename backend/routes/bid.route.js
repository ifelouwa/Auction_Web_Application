import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
    getUserBids, 
    deleteBid,
    placeBid,
    getBidsForProduct

} from "../controllers/bid.controller.js";

const router = express.Router();

// Get all bids for the logged-in user
router.get("/my-bids", protect, getUserBids);
router.delete("/:bidId", protect, deleteBid);
router.post("/:id/bid", protect, placeBid);
router.post("/:id/bids", protect, getBidsForProduct);

export default router;
