import mongoose from "mongoose";
import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";
import Subscription from "../models/Subscription.js";
import { deleteImage } from "../Util/CloudinaryUpload.js";
import { checkAuthorization } from "./Authorization.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import { notify } from "../services/notifications.js";

function exceedsContentLimits(str, { maxWords = 30, maxChars = 200 } = {}) {
  const s = (str || "").trim();
  const words = (s.match(/\S+/g) || []).length;   // whitespace-delimited “words”
  const chars = [...s].length;                    // unicode-safe char count
  return { tooManyWords: words > maxWords, tooManyChars: chars > maxChars, words, chars };
}

export const createPost = async (req, res) => {
    checkAuthorization(req, res);

    const actorId = req.user.id;            // creator
    const postData = { ...req.body, author: new mongoose.Types.ObjectId(actorId) };

    // after postData is created, BEFORE attachments/auth logic
const t = exceedsContentLimits(postData.title);
const b = exceedsContentLimits(postData.body);

if (t.tooManyWords || t.tooManyChars || b.tooManyWords || b.tooManyChars) {
  return res.status(400).json({
    message: "Title/body exceeds limits",
    limits: { maxWords: 30, maxChars: 200 },
    title: { words: t.words, chars: t.chars },
    body:  { words: b.words, chars: b.chars }
  });
}

    postData.attachments = postData.attachments || [];
    if (Array.isArray(req.files)) postData.attachments = req.attachments || [];

    if (req.user.role !== "creator") {
        postData.attachments.forEach(pic => deleteImage(pic.publicId));
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        // 1) Create the post
        const newPost = await new Post(postData).save();

        // 2) Notify active subscribers (don’t fail the request if this hiccups)
        try {
            const subs = await Subscription.find({ creatorId: actorId, active: true })
                .select("subscriberId")
                .lean();

            const creatorName = req.user?.username || "A creator you follow";

            await Promise.all(
                subs.map(s =>
                    notify({
                        userId: s.subscriberId,
                        actorId,                         // who caused it
                        type: "post:new",
                        message: `${creatorName} posted a new update`,
                        metadata: {
                            postId: newPost._id,
                            creatorId: actorId,
                            link: `/post/${newPost._id}`, // direct to post
                        },
                    })
                )
            );
        } catch (nErr) {
            console.warn("notify(post:new) failed:", nErr);
        }

        return res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        return res.status(501).json({ message: error });
    }
};

export const getAllPosts = async (req, res) => {
  checkAuthorization(req, res);
  const user = req.user.id;
  let creator;

  if (req.params.creatorId) {
    creator = req.params.creatorId;
  }

  // case 1: creator seeing own posts
  if (!creator) {
    try {
      const posts = await Post.find({ author: user });
      const postIds = posts.map(p => p._id);

      // counts for likes
      const likeCounts = await PostLike.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", n: { $sum: 1 } } }
      ]);
      const likeMap = new Map(likeCounts.map(c => [String(c._id), c.n]));

      // counts for comments
      const commentCounts = await Comment.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", n: { $sum: 1 } } }
      ]);
      const commentMap = new Map(commentCounts.map(c => [String(c._id), c.n]));

      // which posts current user liked
      const liked = await PostLike.find(
        { postId: { $in: postIds }, subscriberId: user },
        { postId: 1, _id: 0 }
      ).lean();
      const likedSet = new Set(liked.map(d => String(d.postId)));

      const withCounts = posts.map(p => ({
        ...p.toObject(),
        likeCount: likeMap.get(String(p._id)) || 0,
        commentCount: commentMap.get(String(p._id)) || 0,
        likedByMe: likedSet.has(String(p._id))
      }));

      return res.status(200).json(withCounts);

    } catch (error) {
      return res.status(404).json({ message: error });
    }
  }

  // case 2: subscriber viewing a creator's posts
  else if (creator && await isSubscribed(user, creator)) {
    try {
      const posts = await Post.find({ author: creator });
      const postIds = posts.map(p => p._id);

      // likes
      const likeCounts = await PostLike.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", n: { $sum: 1 } } }
      ]);
      const likeMap = new Map(likeCounts.map(c => [String(c._id), c.n]));

      // comments
      const commentCounts = await Comment.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", n: { $sum: 1 } } }
      ]);
      const commentMap = new Map(commentCounts.map(c => [String(c._id), c.n]));

      const liked = await PostLike.find(
        { postId: { $in: postIds }, subscriberId: user },
        { postId: 1, _id: 0 }
      ).lean();
      const likedSet = new Set(liked.map(d => String(d.postId)));

      const withCounts = posts.map(p => ({
        ...p.toObject(),
        likeCount: likeMap.get(String(p._id)) || 0,
        commentCount: commentMap.get(String(p._id)) || 0,
        likedByMe: likedSet.has(String(p._id))
      }));

      return res.status(200).json(withCounts);

    } catch (error) {
      return res.status(404).json({ message: error });
    }
  }

  else {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};

const isSubscribed = async (user, creator) => {
    const subscription = await Subscription.findOne({
        subscriberId: user,
        creatorId: creator,
        active: true
    });
    if (subscription) {
        console.log("subscribed")
        return true;
    } else {
        console.log("not subscribed")
        return false;
    }
}

// Private/Posting.js (editPost)
export const editPost = async (req, res) => {
  checkAuthorization(req, res);
  const user = req.user.id;
  const role = req.user.role;
  const postId = req.params.postId;

  const editData = { ...req.body };

  // right after: const editData = { ...req.body };
if (editData.title) {
  const t = exceedsContentLimits(editData.title);
  if (t.tooManyWords || t.tooManyChars) {
    return res.status(400).json({
      message: "Title exceeds limits",
      limits: { maxWords: 30, maxChars: 200 },
      title: { words: t.words, chars: t.chars }
    });
  }
}
if (editData.body) {
  const b = exceedsContentLimits(editData.body);
  if (b.tooManyWords || b.tooManyChars) {
    return res.status(400).json({
      message: "Body exceeds limits",
      limits: { maxWords: 30, maxChars: 200 },
      body: { words: b.words, chars: b.chars }
    });
  }
}

  // Parse incoming JSON fields if present
  let keptExisting = [];
  try {
    if (editData.keptExisting) {
      keptExisting = Array.isArray(editData.keptExisting)
        ? editData.keptExisting
        : JSON.parse(editData.keptExisting);
    }
  } catch { keptExisting = []; }

  const replaceAll = String(editData.replaceAll).toLowerCase() === 'true';

  const old = await Post.findById(postId).select('author attachments');
  if (!old) return res.status(404).json({ message: 'Post not found' });
  if (role !== 'creator' || old.author?.toString() !== user) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  const newUploads = Array.isArray(req.files) && req.files.length > 0 ? (req.attachments || []) : [];
  let nextAttachments = old.attachments;

  let toDelete = [];
  if (replaceAll) {
    // explicit full replace
    nextAttachments = newUploads;
    toDelete = (old.attachments || []).map(a => a.publicId).filter(Boolean);
  } else if (keptExisting.length) {
    // partial keep/delete path
    const keepSet = new Set(keptExisting);
    const keptObjects = (old.attachments || []).filter(a => keepSet.has(a.publicId));
    nextAttachments = [...keptObjects, ...newUploads];
    const oldIds = (old.attachments || []).map(a => a.publicId);
    toDelete = oldIds.filter(pid => !keepSet.has(pid));
  } else if (newUploads.length) {
    // default append mode
    nextAttachments = [...old.attachments, ...newUploads];
    toDelete = []; // keep all old
  }

  const updated = await Post.findByIdAndUpdate(
    postId,
    { $set: { title: editData.title ?? old.title, body: editData.body ?? old.body, attachments: nextAttachments } },
    { new: true }
  );

  for (const pid of toDelete) {
    if (pid) await deleteImage(pid);
  }

  return res.status(200).json({ message: 'Post edited successfully', post: updated });
};



export const deletePost = async (req, res) => {
    checkAuthorization(req, res);
    const user = req.user.id;
    const role = req.user.role;
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId).select('author attachments');
        if (role === "creator" && post.author?.toString() === user) {
            await Post.findByIdAndDelete(postId);
            post.attachments.map(pic => { deleteImage(pic.publicId) });
            return res.status(200).json({ message: "Successfully deleted ", post });
        } else {
            return res.status(401).json({ message: "Unauthorized access" });
        }
    } catch (error) {
        console.log("Delete error");
        return res.status(500).json({ message: error });
    }
};

// controllers/post.js (or wherever togglePostLike lives)
export const togglePostLike = async (req, res) => {
  try {
    checkAuthorization(req, res);
    const userId = req.user.id;
    const { postId } = req.params;

    const post = await Post.findById(postId).select('author');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // ✅ allow if user is the creator or a subscriber
    const allowed = userId.toString() === post.author.toString() 
                 || await isSubscribed(userId, post.author);
    if (!allowed) return res.status(401).json({ message: 'Unauthorized access' });

    const existing = await PostLike.findOne({ postId, subscriberId: userId });
    let liked;

    if (existing) {
      await existing.deleteOne();
      liked = false;
    } else {
      await PostLike.create({ postId, subscriberId: userId });
      liked = true;
    }

    const likeCount = await PostLike.countDocuments({ postId });
    res.set('Cache-Control', 'no-store');

    return res.status(200).json({ liked, likeCount });
  } catch (err) {
    if (err?.code === 11000) {
      const likeCount = await PostLike.countDocuments({ postId: req.params.postId });
      return res.status(200).json({ liked: true, likeCount });
    }
    return res.status(500).json({ message: err?.message || 'Server error' });
  }
};




export const getPostWithComments = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;

    try {
        console.log("📌 Looking for post ID:", req.params.postId);
        console.log("🔎 req.user:", req.user);       // Should include `id` and `_id`
        console.log("🧠 req.user._id:", req.user._id);
        console.log("🧠 req.user.id:", req.user.id); // Might be undefined
        const post = await Post.findById(postId).populate('author', 'username');
        console.log("Populated author:", post.author);
        console.log("📌 Post found:", post);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        // ✅ post likes
        const [likeCount, likedByMeDoc] = await Promise.all([
            PostLike.countDocuments({ postId }),
            userId ? PostLike.exists({ postId, subscriberId: userId }) : Promise.resolve(null),
        ]);

        const comments = await Comment.find({ postId: new mongoose.Types.ObjectId(postId) })
            .sort({ createdAt: 1 })
            .populate('user', 'username profilePic role');
        console.log("Hi we are comments: ", comments)
        const formattedComments = await Promise.all(
            comments.filter(c => c.user).map(async comment => {
                const likeCount = await Like.countDocuments({ commentId: comment._id });
                const likedByMe = userId
                    ? await Like.exists({ commentId: comment._id, user: userId })
                    : false;

                return {
                    ...comment.toObject(),
                    likeCount,
                    likedByMe: !!likedByMe,
                    user: comment.user
                };
            })
        );

        return res.status(200).json({
            post: {
                ...post.toObject(),
                likeCount,                      // ← ADD
                likedByMe: !!likedByMeDoc,
                author: {
                    id: post.author._id,
                    name: post.author.username,
                },
            },
            comments: formattedComments
        });

    } catch (error) {
        console.log("🔥 req.user:", req.user);
        console.error("❌ Fetch post with comments error:", error);
        return res.status(500).json({ error: "Failed to fetch post and comments" });
    }
};