import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/comment.model.js';
import Like from '../models/like.model.js'; // ✅ Comment likes
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

/**
 * GET /api/posts/:id
 * Fetch a single post and its associated comments (with like info).
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // 📝 Load all comments for the post
    const comments = await Comment.find({ postId: post._id })
      .sort({ createdAt: 1 })
      .populate('user', 'username'); // Include username

    const userId = req.user?._id || null;


    // 🎯 Format comments with like count and likedByMe
    const formattedComments = await Promise.all(
      comments
        .filter(comment => comment.user)
        .map(async comment => {
          const likeCount = await Like.countDocuments({ commentId: comment._id });

          let likedByMe = false;
          if (userId) {
            likedByMe = await Like.exists({ commentId: comment._id, user: userId });
          }

          return {
            ...comment.toObject(),
            likeCount,
            likedByMe: !!likedByMe,
            user: {
              id: comment.user._id,
              name: comment.user.username,
            },
          };
        })
    );

    res.json({
      post: {
        ...post.toObject(),
        author: {
          id: post.author._id,
          name: post.author.username,
        },
      },
      comments: formattedComments
    });
  } catch (err) {
    console.error('❌ Fetch post by ID error:', err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

export default router;
