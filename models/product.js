import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: {
    type: String,
    enum: ["Electronics", "Kitchen & Dining", "Books & Stationery", "Home Appliances", "Vehicles", "Sports & Outdoor", "Home Decor","Furniture","Mobile","Tools & Equipment","Clothing & Accessories","Toys & Baby"],
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: { type: String, required: false },
  isActive: { type: Boolean, default: true },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
