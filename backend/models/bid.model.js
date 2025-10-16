import mongoose from "mongoose";

//Bid Schema form or required details to create a bid

const bidSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    },

    { timestamps: true },

);

const Bid = mongoose.model("Bid", bidSchema);

export default Bid;
