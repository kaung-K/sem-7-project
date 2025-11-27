import SubscriptionInvoice from "../models/SubscriptionInvoice.js";
import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";
import Comment from "../models/comment.model.js";

export const revenueLast6Months = async (req, res) => {
  const creatorId = req.user.id;

  const rows = await SubscriptionInvoice.aggregate([
    { $match: { creatorId: new (await import("mongoose")).default.Types.ObjectId(creatorId) } },
    { $group: {
        _id: { y: { $year: "$paidAt" }, m: { $month: "$paidAt" } },
        cents: { $sum: "$amount" }
    }},
    { $sort: { "_id.y": 1, "_id.m": 1 } }
  ]);

  // map to last 6 calendar months (fill 0s)
  const now = new Date();
  const out = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear(), m = d.getMonth() + 1;
    const hit = rows.find(r => r._id.y === y && r._id.m === m);
    out.push({ month: d.toLocaleString("en", { month: "short" }), revenue: (hit?.cents ?? 0) / 100 });
  }
  res.json(out);
};

// controllers/analytics.js
export const weeklyEngagement = async (req, res) => {
  const creatorId = req.user.id;

  // last 7 days from midnight
  const start = new Date();
  start.setHours(0,0,0,0);
  start.setDate(start.getDate() - 6);

  // all posts by this creator
  const postIds = (await Post.find({ author: creatorId }).select("_id")).map(p => p._id);

  // likes = postlikes, comments = comments
  const [likesAgg, commentsAgg] = await Promise.all([
    PostLike.aggregate([
      { $match: { postId: { $in: postIds }, createdAt: { $gte: start } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Yangon" } },
          n: { $sum: 1 }
      }}
    ]),
    Comment.aggregate([
      { $match: { postId: { $in: postIds }, createdAt: { $gte: start } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Yangon" } },
          n: { $sum: 1 }
      }}
    ])
  ]);

  // build last 7 days
  const iso = d => d.toISOString().slice(0,10);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0,0,0,0);
    return iso(d);
  });

  const countFor = (arr, key) => arr.find(x => x._id === key)?.n ?? 0;

  const data = days.map(k => ({
    day: new Date(k).toLocaleString("en", { weekday: "short", timeZone: "Asia/Yangon" }),
    likes: countFor(likesAgg, k),
    comments: countFor(commentsAgg, k),
    shares: 0,
  }));

  res.json(data);
};
