import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) return res.json({ success: true, items: [] });
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: "productId required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
    const currentQuantityInCart = itemIndex > -1 ? cart.items[itemIndex].quantity : 0;

    if (product.stock < currentQuantityInCart + quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
      });
    }

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populated = await cart.populate("items.product");
    res.json({ success: true, cart: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: "productId required" });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ success: false, message: "Item not in cart" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot set quantity. Only ${product.stock} available.`,
      });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    const populated = await cart.populate("items.product");
    res.json({ success: true, cart: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: "Product ID is required" });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    await cart.save();
    const populated = await cart.populate("items.product");

    res.json({ success: true, message: "Product removed from cart", cart: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
