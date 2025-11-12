import Product from "../models/product.model.js";
import Bid from "../models/bid.model.js";
import User from "../models/user.model.js"


//Get all bids placed by the logged-in user
export const getUserBids = async (req, res) => {
  try {
    const userId = req.user._id;
    const bids = await Bid.find({ bidder: userId })
      .populate("product", "title currentPrice status")
      .sort({ createdAt: -1 });

    if (!bids.length) {
      return res.status(404).json({ success: false, message: "No bids found for this user" });
    }

    const bidCount = bids.length;
    const highestBid = Math.max(...bids.map(b => b.amount));

    res.status(200).json({ success: true, totalBids: bidCount, highestBid, data: bids });

  } catch (error) {
    console.error("Error fetching user bids:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Delete a bid, only by the user who made it
export const deleteBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const userId = req.user.id;

    const bid = await Bid.findById(bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    if (bid.bidder.toString() !== userId)
      return res.status(403).json({ message: "You can only delete your own bids" });

    await Product.updateOne({ _id: bid.product }, { $pull: { bids: bid._id } });

    await bid.deleteOne();

    res.status(200).json({ message: "Bid deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Place a bid on a product
export const placeBid = async (req, res) => {
  try {
    const { id } = req.params; //Product ID
    const { amount } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.status !== "active" || new Date() > product.endTime) {
      return res.status(400).json({ success: false, message: "Bidding closed for this product" });
    }

    if (amount <= product.currentPrice) {
      return res.status(400).json({ success: false, message: "Bid must be higher than current price" });
    }

    const newBid = new Bid({
      amount,
      bidder: req.user._id,
      product: product._id,
    });
    await newBid.save();

    product.currentPrice = amount;
    product.bids.push(newBid._id);
    await product.save();

     //Increase user's bid count since user model has "bidCount"
    await User.findByIdAndUpdate(req.user._id, { $inc: { bidCount: 1 } });

    res.status(201).json({ success: true, message: "Bid placed successfully", data: newBid });
  } catch (error) {
    console.error("Error placing bid:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Get all bids for a specific product, sorted by amount
export const getBidsForProduct = async (req, res) => {
  try {
    const { id } = req.params; // Product ID
    const bids = await Bid.find({ product: id })
      .sort({ amount: -1 })
      .populate("bidder", "name email");

    if (!bids.length) {
      return res.status(404).json({ success: false, message: "No bids found" });
    }

    res.status(200).json({ success: true, data: bids });
  } catch (error) {
    console.error("Error fetching bids:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
