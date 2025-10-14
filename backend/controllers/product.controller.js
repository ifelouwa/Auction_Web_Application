import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const getProducts = async ( req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("error in fetching products:", error.message);
    res.status(500).json({ success: false, message: "No Products Found" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params; 
  if (!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({ success: false, message: "Invalid Product Id"});
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log("Error in fetching product by id:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  } 
};

export const createProduct = async (req, res) => {
  try {
    const { title, startingPrice, image, description, startTime, endTime } = req.body;

    if (!title || !startingPrice || !image) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const newProduct = new Product({
      title,
      description,
      startingPrice,
      image,
      startTime,
      endTime,
      seller: req.user.id, //tie to logged-in user
    });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({ success: false, message: "Invalid Product Id"});
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: updatedProduct });
    console.log("Updates received:", req.body);
  }catch (error) {
    res.status(500).json({ success: false, message: "Product not updated" });
    console.log("Error in updating product:", error.message);
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Product Id" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Only admin OR owner can delete
    if (req.user.role !== "admin" && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error deleting product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
