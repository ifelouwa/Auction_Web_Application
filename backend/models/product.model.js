import mongoose from 'mongoose';

// Product Schema (form or required details to create a product)

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number, default: 0 },
    image: {type: String, required: true },  // Array of image URLs
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["active", "closed"], default: "active" }
},

{ timestamps: true },

);

const Product = mongoose.model("Product", productSchema);

export default Product;