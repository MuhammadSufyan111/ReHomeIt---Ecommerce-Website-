import express from "express";
import { getCart, addToCart, updateCartItem, clearCart,removeFromCart } from "../controllers/cart.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateCartItem); 
router.delete("/clear", protect, clearCart);
router.delete("/remove", protect, removeFromCart); 


export default router;
