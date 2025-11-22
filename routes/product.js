import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  searchProducts
} from "../controllers/product.js";
import { protect } from "../middleware/authmiddleware.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get("/search", searchProducts);
router.get("/", getAllProducts);
router.get("/category/:categoryName", getProductsByCategory);
router.get("/:id", getProductById);



router.post("/", protect,upload.single("image"), createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
