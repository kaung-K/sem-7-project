import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true }
}, { timestamps: true });

LikeSchema.index({ user: 1, commentId: 1 }, { unique: true });

const Like = mongoose.model('Like', LikeSchema);

export default Like;
