// controllers/dashboard.js
import Base from "../models/Base.js";
import Subscription from "../models/Subscription.js"
import dotenv from "dotenv";
import Stripe from "stripe";
import User from "../models/User.js";
import { Creator } from "../models/Creator.js";
import Post from "../models/Post.js";
import { handleExistingCreator, handleStripeError } from "../Util/StripeHandler.js";
import { checkAuthorization } from "./Authorization.js";
import { deleteImage } from "../Util/CloudinaryUpload.js";

export const getBookMarks = async (req, res) => {
  try {
    checkAuthorization(req, res);
    let user;
    switch (req.user.role) {
      case "user": user = User.findById(req.user.id).select('bookMarks'); break;
      case "creator": user = User.findById(req.user.id).select('bookMarks'); break;
      default: return res.status(404).json({ message: "Requested data not found" });
    }
    return res.status(200).json({ bookMarks: user.bookMarks });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export async function getDashboardData(req, res) {
  try {
    checkAuthorization(req, res);
    const userId = req.user.id;
    const userRole = req.user.role;

    let detailedUser;

    // Step 2: Use the role to query the appropriate discriminator
    switch (userRole) {
      case "user":
        detailedUser = await User.findById(userId)
          .select("username profilePic bio role")
          .lean();
        detailedUser.subscriptions = await getSubs(userId);
        break;

      case "creator":
        detailedUser = await Creator.findById(userId)
          .select("username profilePic bio role")
          .lean();
        detailedUser.subscriptions = await getSubs(userId);
        detailedUser.subscribers = await getFans(userId);
        break;

      case "admin":
        detailedUser = await Base.findById(userId)
          .select("username profilePic bio role email")
          .lean();
        // Admin doesn't need subscriptions, but let's add platform stats
        detailedUser.platformStats = {
          totalUsers: await User.countDocuments(),
          totalCreators: await Creator.countDocuments(),
          totalPosts: await Post.countDocuments(),
        };
        break;

      default:
        return res.status(400).json({ message: "Unknown user role." });
    }

    if (!detailedUser) {
      return res.status(404).json({ message: "Full user data not found." });
    }

    // Step 3: Return data
    return res.status(200).json(detailedUser);

  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const getSubs = async (userId) => {
  const subs = await Subscription.find({
    subscriberId: userId,
    active: true,
  })
    .select('creatorId') // include the field we need
    .populate('creatorId', 'username bio profilePic role') // bring creator doc

  // return populated creators
  return subs.map(s => s.creatorId);
};

const getFans = async (userId) => {
  const subs = await Subscription.find({
    creatorId: userId,
    active: true,
  })
    .select('subscriberId') // include the field we need
    .populate('subscriberId', 'username bio profilePic role'); // bring subscriber doc

  // return populated subscribers
  return subs.map(s => s.subscriberId);
};


export const getSubscriptions = async (req, res) => {
  try {
    checkAuthorization(req, res);
    const subscriptions = await getSubs(req.user.id);
    return res.status(200).json(subscriptions);
  } catch (err) {
    return res.status(500).json({ message: String(err) });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    checkAuthorization(req, res);
    const subscribers = await getFans(req.user.id);
    return res.status(200).json(subscribers);
  } catch (err) {
    return res.status(500).json({ message: String(err) });
  }
};


export const updateDashboardData = async (req, res) => {
  try {
    checkAuthorization(req, res);
    const { id: userId, role } = req.user;

    // Build update payload from body (only allow known fields)
    const updateData = {};
    if (typeof req.body.username === "string") updateData.username = req.body.username;
    if (typeof req.body.bio === "string") updateData.bio = req.body.bio;

    // If a new image was uploaded by your upload middleware
    let newPic;
    if (Array.isArray(req.attachments) && req.attachments.length) {
      [newPic] = req.attachments;
      // Expecting { url, publicId } from your Cloudinary middleware
      updateData.profilePic = { url: newPic.url, publicId: newPic.publicId };
    }

    const Model = role === "creator" ? Creator : User;

    // Fetch current pic to decide if we should delete it after update
    const oldUser = await Model.findById(userId).select("profilePic");
    if (!oldUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedUser = await Model.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // If we uploaded a new pic, delete the old one (if it existed and is different)
    if (
      newPic &&
      oldUser.profilePic?.publicId &&
      oldUser.profilePic.publicId !== newPic.publicId
    ) {
      try {
        await deleteImage(oldUser.profilePic.publicId);
      } catch (e) {
        console.warn("Failed to delete old image:", e.message);
      }
    }

    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);

    // Roll back newly uploaded image if anything failed AFTER upload
    try {
      if (Array.isArray(req.attachments) && req.attachments.length) {
        await deleteImage(req.attachments[0].publicId);
      }
    } catch (e) {
      console.warn("Rollback image delete failed:", e.message);
    }

    return res.status(500).json({ success: false, message: "Update Failed", error: error.message });
  }
};


dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const upgradeToCreator = async (req, res) => {
  checkAuthorization(req, res);
  const userId = req.user.id;
  let upgradeData = { ...req.body }

  const user = await Base.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found." });

  // Check if already a creator
  if (user.role === "creator") {
    return handleExistingCreator(user, res);
  }

  try {

    const stripeAccount = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: user.email,
      capabilities: {
        transfers: { requested: true },
      },
      business_type: "individual",
      individual: {
        email: user.email,
      },
    });

    const creator = await User.findByIdAndUpdate(
      userId,
      {
        role: "creator",
        payoutInfo: stripeAccount.id,
        onboardingComplete: false,
        $set: upgradeData
      },
      { new: true, runValidators: true, overwriteDiscriminatorKey: true }
    )

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccount.id,
      refresh_url: `${process.env.REQ_ORIGIN}/dashboard`,
      return_url: `${process.env.REQ_ORIGIN}/login?upgraded=1`,
      type: "account_onboarding",
    });

    return res.status(201).json({
      success: true,
      message: "Creator account created. Complete Stripe onboarding to receive payments.",
      onboardingUrl: accountLink.url,
      creator: creator,
      onboardingComplete: false
    });
  } catch (err) {
    console.error("Update error:", err);
    return handleStripeError(err, res);
  }
};