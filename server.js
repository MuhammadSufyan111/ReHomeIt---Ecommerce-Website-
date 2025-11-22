import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";

import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import adminRoutes from "./routes/admin.js";
import orderRoutes from "./routes/order.js";
import sellerRoutes from "./routes/seller.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();
app.use(cors());
app.use(bodyParser.json());



app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("E-commerce API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
