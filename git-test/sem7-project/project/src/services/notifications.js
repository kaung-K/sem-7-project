// src/services/notifications.js
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:3002/api";

/**
 * GET /api/notifications
 * @param {Object} opts
 * @param {string=} opts.cursor
 * @param {number=} opts.limit
 * @param {string=} opts.type     // "comment,like" etc
 * @param {"true"|"false"=} opts.read
 */
export const fetchNotifications = (opts = {}) =>
  axios.get(`${API}/notifications`, { params: opts });

/** GET /api/notifications/unread/count -> { count } */
export const getUnreadCount = () =>
  axios.get(`${API}/notifications/unread/count`);

/** PATCH /api/notifications/:id/read */
export const markAsRead = (id) =>
  axios.patch(`${API}/notifications/${id}/read`);

/** PATCH /api/notifications/read-all */
export const markAllRead = () =>
  axios.patch(`${API}/notifications/read-all`);

/** DELETE /api/notifications/:id */
export const deleteNotification = (id) =>
  axios.delete(`${API}/notifications/${id}`);
