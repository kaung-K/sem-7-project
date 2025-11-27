import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';  // adjust path as needed
import Base from "../models/Base.js"; // ⬅️ Import the base model instead of User

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('➡️ [DEBUG] req.user:', req.user);
    console.log('➡️ [DEBUG] req.user._id:', req.user?._id);

    const user = await Base.findById(req.user._id).select('-password'); 

    console.log('✅ [DEBUG] Fetched user from DB:', user);

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ user });
  } catch (err) {
    console.error('❌ [ERROR] Failed to fetch user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
