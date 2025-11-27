import mongoose from 'mongoose';  // Use import for ES Modules
import '../models/User.js';

const commentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: function () {
      // only require message if not soft-deleted
      return !this.deleted;
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: false },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

// Export the model using ES Modules syntax
export default mongoose.model('Comment', commentSchema);
