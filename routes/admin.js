import express from "express";
import { protect, adminOnly } from "../middleware/authmiddleware.js";
import {
  getAllUsers,
  deleteUser,
  toggleUserStatus,
  getAllProducts,
  deleteProductAdmin,
} from "../controllers/admin.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.delete("/user/:id", deleteUser);
router.put("/user/toggle/:id", toggleUserStatus);

router.get("/products", getAllProducts);
router.delete("/product/:id", deleteProductAdmin);

export default router;
