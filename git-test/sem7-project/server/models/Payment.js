import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    creatorId: { type: Schema.Types.ObjectId, ref: "Base", required: true },
    subscriberId: { type: Schema.Types.ObjectId, ref: "Base", required: true },
    amount: { type: Number, required: true },     // in cents from Stripe
    currency: { type: String, default: "usd" },
    stripeSessionId: { type: String, index: true },
    stripePaymentIntent: { type: String, index: true },
    status: { type: String, default: "succeeded" },

    // optional convenience fields
    gross: { type: Number },  // = amount
    fee: { type: Number },    // your platform fee in cents
    net: { type: Number },    // gross - fee
  },
  { timestamps: true, collection: "payments" }
);

export default mongoose.model("Payment", paymentSchema);
