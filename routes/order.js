import express from "express";
import { placeOrder, getMyOrders, getAllOrders } from "../controllers/order.js";
import { protect,adminOnly } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/place", protect, placeOrder);
router.get("/my", protect, getMyOrders);

router.get("/all", protect,adminOnly, getAllOrders);

export default router;
