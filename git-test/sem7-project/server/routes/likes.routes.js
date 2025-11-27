import express from 'express';
import mongoose from 'mongoose';
import authMiddleware from '../middleware/AuthMiddleware.js';
import Like from '../models/like.model.js';  // ✅ This is for comment likes

const router = express.Router();

// ✅ POST /api/like - Add a like to a comment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { commentId } = req.body;

    if (!commentId) return res.status(400).json({ error: 'commentId is required' });

    const like = await Like.create({
      user: new mongoose.Types.ObjectId(userId),
      commentId: new mongoose.Types.ObjectId(commentId),
    });

    res.status(201).json(like);
  } catch (err) {
    console.error('❌ Create like error:', err.message, err.keyValue);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'You already liked this comment.' });
    }
    res.status(500).json({ error: 'Failed to like comment' });
  }
});

// ✅ GET /api/likes/:commentId - Get all likes for a comment
router.get('/:commentId', async (req, res) => {
  try {
    const likes = await Like.find({ commentId: req.params.commentId });
    res.json(likes);
  } catch (err) {
    console.error('Fetch likes error:', err);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
});

// ✅ POST /api/like/toggle - Toggle like for a comment 
router.post('/toggle', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { commentId } = req.body;

    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: 'Valid commentId is required' });
    }

    const existingLike = await Like.findOne({
      user: userId,
      commentId: new mongoose.Types.ObjectId(commentId),
    });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.json({ addLike: false });
    } else {
      await Like.create({
        user: userId,
        commentId: new mongoose.Types.ObjectId(commentId)
      });
      return res.json({ addLike: true });
    }
  } catch (err) {
    console.error('Toggle like error:', err);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});


export default router;       