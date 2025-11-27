// models/SubscriptionInvoice.js
import mongoose from "mongoose";
const schema = new mongoose.Schema({
  creatorId:    { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
  subscriberId: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
  amount:       { type: Number, required: true }, // cents
  currency:     { type: String, default: "usd" },
  paidAt:       { type: Date, default: Date.now },
  stripeId:     { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model("SubscriptionInvoice", schema);
