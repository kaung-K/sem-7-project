// models/PostLike.js
import mongoose, { model, Schema } from "mongoose";

const postLikeSchema = new Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    subscriberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// one like per user per post
postLikeSchema.index({ postId: 1, subscriberId: 1 }, { unique: true });

export default model('PostLike', postLikeSchema);
