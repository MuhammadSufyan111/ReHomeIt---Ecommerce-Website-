import express from "express";
import { protect, sellerOnly } from "../middleware/authmiddleware.js";
import {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteMyProduct,
} from "../controllers/seller.js";
import User from "../models/user.js";
import { upload } from "../utils/multer.js";


const router = express.Router();


router.post("/become", protect, async (req, res) => {
  try {
    if (req.user.role === "seller") {
      return res.status(400).json({ message: "You are already a seller." });
    }

    const user = await User.findById(req.user._id);
    user.role = "seller";
    await user.save();

    res.json({ message: "You are now a seller!", role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Error upgrading to seller", error: err.message });
  }
});


router.use(protect, sellerOnly);

router.get("/my-products", getMyProducts);

router.post("/product",upload.single("image"), createProduct);

router.put("/product/:id",upload.single("image"), updateProduct);

router.delete("/product/:id", deleteMyProduct);

export default router;
