import User from "../models/user.js";
import Product from "../models/product.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive; 
    await user.save();

    res.json({
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email role");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProductAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


