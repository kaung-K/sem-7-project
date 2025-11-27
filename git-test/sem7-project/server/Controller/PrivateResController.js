import { Router } from "express";
import upload from "../middleware/UploadMiddleware.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { getDashboardData, getSubscriptions, getSubscribers, updateDashboardData, upgradeToCreator, getBookMarks} from "../Private/Dashboard.js";
import { retryStripeOnboarding, getStripeDashboardLink } from "../Util/StripeHandler.js";
import { uploadToCloudinary } from "../Util/CloudinaryUpload.js";
import { subscribeToCreator } from "../Private/Subscribing.js";
import { createPost, deletePost, editPost, getAllPosts,togglePostLike } from "../Private/Posting.js";
import commentRoutes from '../routes/comments.routes.js';
import likeRoutes from '../routes/likes.routes.js';
import { getPostWithComments } from "../Private/Posting.js";
import { revenueLast6Months, weeklyEngagement } from "../Private/Analytics.js";
import { getAdminDashboard, getAllUsers } from "../Private/AdminAnalysis.js";

const router = Router();

router.get("/creator/subscribed", authMiddleware, getSubscriptions);
router.get("/subscriber", authMiddleware, getSubscribers);
router.get("/bookmarks", authMiddleware, getBookMarks);
router.get("/dashboard", authMiddleware, getDashboardData);
router.patch("/dashboard", authMiddleware, upload.single('profilePic'), uploadToCloudinary, updateDashboardData);
router.patch("/upgrade", authMiddleware, upload.none(), upgradeToCreator)
router.get("/stripe/onboarding", authMiddleware, retryStripeOnboarding);
router.get("/stripe/dashboard", authMiddleware, getStripeDashboardLink);
router.post("/subscribe/:creatorId", authMiddleware, subscribeToCreator );
router.post("/post",authMiddleware,upload.array('attachments',4), uploadToCloudinary, createPost);
router.get("/post/detail/:postId", authMiddleware, getPostWithComments);
router.get("/post",authMiddleware, getAllPosts);
router.get("/post/:creatorId",authMiddleware, getAllPosts);
router.patch("/post/:postId", authMiddleware, upload.array('attachments',4), uploadToCloudinary, editPost);
router.delete("/post/:postId", authMiddleware, deletePost);
router.post("/post/togglepostlike/:postId", authMiddleware, togglePostLike);
router.use('/comment', authMiddleware, commentRoutes);  // ✅ protected comment routes
router.use('/like', authMiddleware, likeRoutes);
router.get("/analytics/revenue-6m", authMiddleware, revenueLast6Months);
router.get("/analytics/weekly-engagement", authMiddleware, weeklyEngagement);
router.get("/admin/dashboard", authMiddleware, getAdminDashboard);
router.get("/admin/users", authMiddleware, getAllUsers);

export default router;