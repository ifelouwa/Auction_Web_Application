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

export const createProduct = async ( req, res) => {
  const product = req.body;  //user will send this data

  if(!product.title || !product.startingPrice || !product.image) {
    return res.status(400).json ({ success:false, message: "please provide all fields" });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct});
  } catch (error) {
    console.error("Error in setting up a product", error.message);
    res.status(500).json({success: false, message: "Server Error"});
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
  const {id} = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message:"Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleting product:", error.message);
    res.status(404).json({ success: false, message: "Product not found" });
  }
};