import Category from "../models/category.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category exists" });
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
