import mongoose from "mongoose";
import Product from "../models/product.model.js";

//Get all products
export const getProducts = async ( req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("error in fetching products:", error.message);
    res.status(500).json({ success: false, message: "No Products Found" });
  }
};

//Get product by ID
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

//Create a new product
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
    console.log("Product created:", newProduct._id, "by User:", req.user.name);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Product ID" });
  }

  try {
    // Find the product in DB
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Only admin OR owner can update
    if (
      product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to update this product" });
    }

    // Proceed with update
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {new: true,runValidators: true,
    });

    console.log("Product Updated:", id, "User is: ",req.user.name);
    res.status(200).json({ success: true, data: updatedProduct });

  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Delete a product
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

    //Only admin OR owner can delete
    if (req.user.role !== "admin" && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(id);
    console.log("Product Deleted:", id, "User is: ",req.user.name);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error deleting product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
