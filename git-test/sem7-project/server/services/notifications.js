// services/notification.service.js
import mongoose from "mongoose";
import Notification from "../models/notification.model.js";

/**
 * Create and (optionally) push a notification.
 * @param {Object} p
 * @param {string|ObjectId} p.userId
 * @param {string|ObjectId} [p.actorId]
 * @param {string} p.type                // e.g. 'post:new', 'comment:new', 'comment:reply', 'sub:new'
 * @param {string} [p.message]
 * @param {Object} [p.metadata]          // { postId, commentId, creatorId, subscriberId, link, ... }
 */
export async function notify({ userId, actorId, type, message, metadata = {} }) {
  // Always pull IDs from metadata; never use bare variables
  const { postId, commentId, creatorId } = metadata;

  // If caller didn't supply metadata.link, build a sensible default
  let link = metadata.link;
  if (!link) {
    if (type.startsWith("comment:") && postId && commentId) {
      link = `/post/${postId}?highlight=${commentId}`;
    } else if (type === "post:new" && postId) {
      link = `/post/${postId}`;
    } else if (type === "sub:new" && creatorId) {
      link = `/creator/${creatorId}`;
    }
  }

  const doc = await Notification.create({
    user_id: new mongoose.Types.ObjectId(userId),
    actor_id: actorId ? new mongoose.Types.ObjectId(actorId) : undefined,
    type,
    message,
    metadata: { ...metadata, link },   // persist the resolved link
  });

  // global.io?.to(String(userId)).emit("notification:new", doc);
  return doc;
}
