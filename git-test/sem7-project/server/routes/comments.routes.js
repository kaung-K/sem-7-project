import express from 'express';  // Import express using ES Modules
import mongoose from 'mongoose'; // Import mongoose
import Comment from '../models/comment.model.js'; // Import your Comment model (add .js extension)
import Post from '../models/Post.js';  // Import Post model (add .js extension)
import Notification from '../models/notification.model.js';  // Import Notification model (add .js extension)
import authMiddleware from '../middleware/AuthMiddleware.js';
import Like from '../models/like.model.js';  // ✅ CORRECT ES Module
import { notify } from '../services/notifications.js';

const router = express.Router();

// ✅ CREATE COMMENT — Protected
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { message, postId, parentId } = req.body;
    const me = req.user;

    if (!message || !postId) {
      return res.status(400).json({ error: 'Message and postId are required' });
    }

    // create the comment
    const comment = await Comment.create({
      message,
      user: new mongoose.Types.ObjectId(me._id),
      postId: new mongoose.Types.ObjectId(postId),
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null
    });

    // populate for client response
    await comment.populate({ path: 'user', select: 'username profilePic role' });

    // find post author once (used in both paths)
    const post = await Post.findById(postId).select('author').lean();

    // --- Notifications ---
try {
  const meId = req.user._id;
  const meName = req.user?.username || 'Someone';

  if (parentId) {
    // reply to an existing comment -> notify parent comment author
    const parent = await Comment.findById(parentId).select('user').lean();
    if (parent && String(parent.user) !== String(meId)) {
      await notify({
        userId: parent.user,            // recipient
        actorId: meId,                  // who triggered
        type: 'comment:reply',
        message: `${meName} replied to your comment`,
        metadata: {
    postId,
    commentId: comment._id,
    link: `/post/${postId}?highlight=${comment._id}`,
  },
      });
    }
  } else {
    // top-level comment -> notify post author/creator
    const post = await Post.findById(postId).select('author').lean();
    if (post?.author && String(post.author) !== String(meId)) {
      await notify({
        userId: post.author,
        actorId: meId,
        type: 'comment:new',
        message: `${meName} commented on your post`,
        metadata: {
    postId,
    commentId: comment._id,
    link: `/post/${postId}?highlight=${comment._id}`,  // add link here
  },
      });
    }
  }
} catch (nErr) {
  console.warn('notify(comment) failed:', nErr);
  // do not fail the request if notifications hiccup
}


    return res.status(201).json(comment);
  } catch (err) {
    console.error('Create comment error:', err);
    return res.status(500).json({ error: 'Failed to create comment' });
  }
});

// ✅ UPDATE COMMENT — Protected
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const { id: commentId } = req.params;
    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    comment.message = message;
    await comment.save();
    // ✅ Use discriminator-aware populate
    await comment.populate({
  path: 'user',
  select: 'username profilePic role'
});

    res.json(comment);
  } catch (err) {
    console.error('Update comment error:', err);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// ✅ DELETE COMMENT — Protected
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    // ✅ Soft delete
    comment.message = null;
    comment.deleted = true;
    await comment.save();
    // ✅ Use discriminator-aware populate
    await comment.populate({
  path: 'user',
  select: 'username profilePic role'
});


    // ✅ Delete associated likes
    await Like.deleteMany({ commentId });

    res.json(comment);
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});


export default router;  // Use export default for ES Module
