// models/notification.model.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    // who receives this notification
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },

    // who caused it (optional)
    actor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Base" },

    // machine-friendly type: 'post:new', 'comment:reply', 'sub:payment', 'report:new', ...
    type: { type: String, required: true, index: true },

    // short human text (keep UI simple)
    message: { type: String },

    // jump target, extra info
    metadata: {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
      commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
      creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Base" },
      status: { type: String }, // e.g. 'paid'|'failed'|'expired'
      amount: { type: Number },
      // add more fields as you need, it's schemaless
    },

    is_read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
