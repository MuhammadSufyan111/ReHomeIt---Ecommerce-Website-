import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js"; 
import { sendEmail } from "../utils/emailService.js"; 

export const placeOrder = async (req, res) => {
  try {
    const { paymentMethod } = req.body; 

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart empty" });

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${item.product.name}. Available: ${item.product.stock}`,
        });
      }
    }

    const items = cart.items.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
    }));

    const totalAmount = cart.items.reduce((sum, i) => {
      const price = i.product.price || 0;
      return sum + price * i.quantity;
    }, 0);

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      status: "Pending",
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    await sendEmail(
      req.user.email,
      "Order Confirmation - ShopEase",
      "orderConfirmation", 
      {
        name: req.user.name,
        items: cart.items.map((i) => ({
          productName: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        totalAmount,
      }
    );

    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") 
      .populate("items.product", "name price"); 

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};
