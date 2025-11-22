import Product from "../models/product.js";

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;
    let image = req.file? req.file.path:null;
    console.log(image,"-----",category)
    if (!name || !price || !stock || !category || !image ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({
      name,
      price,
      stock,
      category,
      image,
      seller: req.user._id,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own products" });
    }

    const { name, price, stock, category } = req.body;
    let image = req.file? req.file.path:null;
    console.log(image,"-----",category)

    product.name = name || product.name;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.image = image || product.image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMyProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own products" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
