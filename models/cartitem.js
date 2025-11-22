import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  subtotal: { type: Number, required: true },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;
