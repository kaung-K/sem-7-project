// routes/notifications.routes.js
import express from 'express';
import mongoose from 'mongoose';
import authMiddleware from '../middleware/AuthMiddleware.js';
import Notification from '../models/notification.model.js';

const router = express.Router();

/**
 * GET /api/notifications
 * Query:
 *  - cursor: string(ObjectId)  -> paginate older items
 *  - limit: number (default 20, max 50)
 *  - type: string | comma list  -> filter by type(s)
 *  - read: 'true' | 'false'     -> filter read state
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      cursor,
      limit: limitRaw = '20',
      type,
      read
    } = req.query;

    const limit = Math.min(Math.max(parseInt(limitRaw, 10) || 20, 1), 50);

    const q = { user_id: new mongoose.Types.ObjectId(userId) };

    if (cursor && mongoose.isValidObjectId(cursor)) {
      q._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    if (typeof read === 'string') {
      if (read === 'true') q.is_read = true;
      if (read === 'false') q.is_read = false;
    }

    if (type) {
      const types = String(type).split(',').map(s => s.trim()).filter(Boolean);
      if (types.length) q.type = { $in: types };
    }

    const items = await Notification.find(q)
      .sort({ _id: -1 })
      .limit(limit)
      .select('type message metadata actor_id is_read createdAt') // keep it light
      .populate({ path: 'actor_id', select: 'username profilePic role', options: { lean: true } })
      .lean();

    const nextCursor = items.length ? String(items[items.length - 1]._id) : null;

    return res.json({ items, nextCursor });
  } catch (err) {
    console.error('GET /notifications error:', err);
    return res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

/**
 * GET /api/notifications/unread/count
 */
router.get('/unread/count', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Notification.countDocuments({
      user_id: new mongoose.Types.ObjectId(userId),
      is_read: false,
    });
    return res.json({ count });
  } catch (err) {
    console.error('GET /notifications/unread/count error:', err);
    return res.status(500).json({ message: 'Failed to fetch unread count' });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read
 */
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid notification id' });
    }

    const result = await Notification.updateOne(
      { _id: id, user_id: req.user.id },
      { $set: { is_read: true } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('PATCH /notifications/:id/read error:', err);
    return res.status(500).json({ message: 'Failed to mark as read' });
  }
});

/**
 * PATCH /api/notifications/read-all
 * Mark all as read for current user
 */
router.patch('/read-all', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user.id, is_read: false },
      { $set: { is_read: true } }
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error('PATCH /notifications/read-all error:', err);
    return res.status(500).json({ message: 'Failed to mark all as read' });
  }
});

/**
 * DELETE /api/notifications/:id
 * (Optional) remove a single notification
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid notification id' });
    }

    const deleted = await Notification.deleteOne({
      _id: id,
      user_id: req.user.id
    });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /notifications/:id error:', err);
    return res.status(500).json({ message: 'Failed to delete notification' });
  }
});

export default router;
