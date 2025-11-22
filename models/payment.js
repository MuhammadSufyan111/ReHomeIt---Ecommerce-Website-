import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  payment_method: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal", "cod"],
    default: "cod",
  },
  payment_status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  transaction_id: { type: String },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
