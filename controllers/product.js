import Product from "../models/product.js";


export const createProduct = async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    let image = req.file ? req.file.path : null;

    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can add products." });
    }

    const validCategories = [
      "Mobile",
      "Furniture",
      "Electronics",
      "Home Appliances",
      "Vehicles",
      "Home Decor",
      "Tools & Equipment",
      "Kitchen & Dining",
      "Sports & Outdoor",
      "Books & Stationery",
      "Clothing & Accessories",
      "Toys & Baby"
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category selected." });
    }

    const product = new Product({
      name,
      price,
      category,
      stock,
      image,
      seller: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};



export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};


export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const products =
      categoryName === "All"
        ? await Product.find().populate("seller", "name email")
        : await Product.find({ category: categoryName }).populate("seller", "name email");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products by category", error: error.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.user.role !== "admin" && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    const { name, price, category, stock, image } = req.body;

    const validCategories = [
      "Mobile",
      "Furniture",
      "Electronics",
      "Home Appliances",
      "Vehicles",
      "Home Decor",
      "Tools & Equipment",
      "Kitchen & Dining",
      "Sports & Outdoor",
      "Books & Stationery",
      "Clothing & Accessories",
      "Toys & Baby"
    ];

    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category selected." });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.image = image || product.image;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.user.role !== "admin" && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};


export const searchProducts = async (req, res) => {
  try {
    let { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    q = q.trim();

    let products = await Product.find({
      name: { $regex: q, $options: "i" }
    }).populate("seller", "name email");

    if (products.length === 0) {
      console.log(" cat")
      products = await Product.find({
        category: { $regex: q, $options: "i" }
      }).populate("seller", "name email");
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error searching products",
      error: error.message
    });
  }
};
