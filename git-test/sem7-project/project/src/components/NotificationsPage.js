import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  fetchNotifications,
  markAsRead,
  markAllRead,
  deleteNotification,
} from "../services/notifications";
import { useNavigate } from "react-router-dom";

const timeAgo = (iso) => {
  if (!iso) return "";
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function NotificationsPage({ isDarkMode, toggleTheme }) {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const wrapperCls = useMemo(
    () =>
      `min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`,
    [isDarkMode]
  );
  const cardCls = isDarkMode
    ? "bg-gray-800 border border-gray-700"
    : "bg-white border border-gray-200";

  const load = async (cursor) => {
    try {
      setLoading(true);
      setErr("");
      const { data } = await fetchNotifications({ cursor, limit: 20 });
      const list = Array.isArray(data?.items) ? data.items : [];
      setItems((prev) => (cursor ? [...prev, ...list] : list));
      setNextCursor(data?.nextCursor || null);
    } catch {
      setErr("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(undefined);
  }, []);

  // Fallback link if metadata.link ever missing
  const computeLink = (n) => {
    if (n?.metadata?.link) return n.metadata.link;

    const md = n?.metadata || {};
    if (md.postId && md.commentId) return `/post/${md.postId}?highlight=${md.commentId}`;
    if (md.postId) return `/post/${md.postId}`;
    if (md.creatorId) return `/creator/${md.creatorId}`;
    return null;
  };

  const onOpen = async (n) => {
    // optimistic read
    setItems((prev) =>
      prev.map((it) => (String(it._id) === String(n._id) ? { ...it, is_read: true } : it))
    );
    try {
      await markAsRead(n._id);
      window.dispatchEvent(new CustomEvent("notif:changed"));
    } catch {
      setItems((prev) =>
        prev.map((it) => (String(it._id) === String(n._id) ? { ...it, is_read: false } : it))
      );
    }

    const link = computeLink(n);
    if (link) navigate(link);
  };

  const onDelete = async (n) => {
    const prev = items;
    setItems((old) => old.filter((x) => String(x._id) !== String(n._id)));
    try {
      await deleteNotification(n._id);
    } catch {
      setItems(prev);
    }
  };

  const onMarkAll = async () => {
    const prev = items;
    setItems((old) => old.map((n) => ({ ...n, is_read: true })));
    try {
      await markAllRead();
      window.dispatchEvent(new CustomEvent("notif:changed"));
    } catch {
      setItems(prev);
    }
  };

  return (
    <div className={wrapperCls}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <div className={`rounded-2xl shadow ${cardCls}`}>
          <div
            className={`flex items-center justify-between px-6 py-4 ${
              isDarkMode ? "border-b border-gray-700" : "border-b border-gray-200"
            }`}
          >
            <h1 className="text-xl font-semibold">Notifications</h1>
            <button
              onClick={onMarkAll}
              className={`text-sm px-3 py-1 rounded-md ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              }`}
            >
              Mark all as read
            </button>
          </div>

          {err && <div className="px-6 py-4 text-red-500">{err}</div>}

          {!err && items.length === 0 && !loading && (
            <div className="px-6 py-16 text-center opacity-70">No notifications yet.</div>
          )}

          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((n) => {
              const actor = n.actor_id;
              const pic = actor?.profilePic;
              const avatar =
                (typeof pic === "string" && pic.trim())
                  ? pic
                  : pic?.url && pic.url.trim()
                  ? pic.url
                  : "/images/default-avatar.png";
              const title = n.message || n.metadata?.title || "Notification";
              const sub = n.metadata?.preview || n.metadata?.snippet || "";
              const when = timeAgo(n.createdAt);

              return (
                <li
                  key={n._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpen(n)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(n)}
                  className={`px-6 py-4 flex items-start gap-4 cursor-pointer transition ${
                    !n.is_read
                      ? isDarkMode
                        ? "bg-gray-800/60 hover:bg-gray-700/60"
                        : "bg-blue-50/50 hover:bg-blue-100/50"
                      : isDarkMode
                      ? "hover:bg-white/5"
                      : "hover:bg-black/5"
                  }`}
                >
                  <img
                    src={avatar}
                    alt={actor?.username || "actor"}
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 rounded-full object-cover shrink-0 bg-gray-200 dark:bg-gray-700"
                    onError={(e) => {
                      e.currentTarget.src = "/images/default-avatar.svg";
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium truncate">{title}</p>
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {when}
                      </span>
                    </div>

                    {sub && (
                      <p
                        className={`text-sm mt-1 line-clamp-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {sub}
                      </p>
                    )}

                    <div className="mt-2 flex gap-3">
                      {!n.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // don't trigger row click
                            onOpen(n);
                          }}
                          className={`text-xs underline ${
                            isDarkMode ? "text-blue-300" : "text-blue-700"
                          }`}
                        >
                          Open
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // don't trigger row click
                          onDelete(n);
                        }}
                        className={`text-xs underline ${
                          isDarkMode ? "text-red-300" : "text-red-600"
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {!n.is_read && (
                    <span className="mt-1 inline-block w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="px-6 py-4 flex justify-center">
            {nextCursor && (
              <button
                onClick={() => load(nextCursor)}
                disabled={loading}
                className={`px-4 py-2 rounded-md ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
              >
                {loading ? "Loading..." : "Load more"}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
