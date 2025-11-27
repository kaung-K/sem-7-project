import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import CommentsSection from "./CommentsSection";
// (optional) keep if you’re using the separate css file
import "../css/PostCard.css";
import { togglePostLike as apiTogglePostLike } from "../services/posts";

const Icon = {
  Heart: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" {...props}>
      <path d="M12 21s-7.2-4.35-9.6-8.4C.5 9.2 2.3 5.5 6 5.5c2 0 3.2 1 4 2 0.8-1 2-2 4-2 3.7 0 5.5 3.7 3.6 7.1C19.2 16.65 12 21 12 21z" />
    </svg>
  ),
  Message: (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
    </svg>
  ),
};

// simple "2h ago" formatter with absolute fallback
function timeAgo(isoLike) {
  try {
    const d = new Date(isoLike);
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (Number.isNaN(s)) return null;
    const units = [
      ["y", 31536000],
      ["mo", 2592000],
      ["w", 604800],
      ["d", 86400],
      ["h", 3600],
      ["m", 60],
      ["s", 1],
    ];
    for (const [label, secs] of units) {
      const v = Math.floor(s / secs);
      if (v >= 1) return `${v}${label} ago`;
    }
    return "just now";
  } catch {
    return null;
  }
}

export default function PostCard({
  post,
  author,        // <-- new (fallback author)
  isDarkMode,
  highlightId,
}) {
  const [openComments, setOpenComments] = useState(false);

  // local like state (optimistic)
  const [liked, setLiked] = useState(post?.likedByMe ?? false);
  const [likeCount, setLikeCount] = useState(
    typeof post?.likeCount === "number" ? post.likeCount : 0
    );

  // keep in sync if parent navigates to a new post id
  React.useEffect(() => {
    setLiked(post?.likedByMe ?? false);
    setLikeCount(typeof post?.likeCount === "number" ? post.likeCount : 0);
    }, [post?._id, post?.id, post?.likedByMe, post?.likeCount]);

  const attachments = Array.isArray(post?.attachments) ? post.attachments : [];

  // author fields (robust to different shapes)
  const rawAuthor = post?.author ?? post?.creator;
  const a = author || (typeof rawAuthor === 'object' ? rawAuthor : null) || {};

  const authorId   = a?._id || a?.id;
  const authorName = a?.username || a?.name || "Unknown";
  const authorHandle = a?.handle ? `@${a.handle}` : "";
  const avatar = (typeof a?.profilePic === "string" ? a.profilePic : a?.profilePic?.url) ||
                 (typeof a?.avatar     === "string" ? a.avatar     : a?.avatar?.url)     ||
                 "/images/creator.jpg";

  const createdAt = post?.createdAt || post?.created_at || post?.created || null;
  const createdLabel = useMemo(() => timeAgo(createdAt) || (createdAt ? new Date(createdAt).toLocaleString() : ""), [createdAt]);

  const textMuted = isDarkMode ? "text-gray-300" : "text-gray-600";
  const cardClasses = `relative p-5 sm:p-6 rounded-2xl backdrop-blur shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 ${
    isDarkMode ? "bg-gray-800/90 border border-gray-700" : "bg-white/90 border border-gray-200"
  }`;

  const toggleComment = () => setOpenComments((v) => !v);

  const handleLikeClick = async () => {
    const pid = post?._id || post?.id;
    if (!pid) return;

    const prevLiked = liked;
    const prevCount = likeCount;

    // optimistic update
    const nextLiked = !prevLiked;
    setLiked(nextLiked);
    setLikeCount(Math.max(0, prevCount + (nextLiked ? 1 : -1)));

    try {
      const res = await apiTogglePostLike(pid); // { liked, likeCount } after backend change
      if (typeof res?.liked === "boolean" && res.liked !== nextLiked) {
        // server disagrees -> sync accurately
        if (typeof res?.liked === "boolean") setLiked(res.liked);
        if (typeof res?.likeCount === "number") setLikeCount(res.likeCount);
      }
    } catch (err) {
      if (err?.status === 401) {
        const redirect = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        window.location.href = `/login?redirect=${redirect}`;
        return;
      }
      // revert on other failures
      setLiked(prevLiked);
      setLikeCount(prevCount);
      console.error("toggle like failed:", err);
    }
  };
  return (
    <article className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 hover:from-blue-600/30 hover:via-purple-600/30 hover:to-pink-600/30 transition-colors duration-300">
      <div className={cardClasses}>
      {/* Header: avatar, author, time */}
      <header className="flex items-start gap-3 mb-3">
        <img
          src={avatar}
          alt={authorName}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-white/60 dark:ring-gray-900/60 ring-offset-2 ring-offset-transparent transition-transform duration-300 group-hover:scale-[1.02]"
          onError={(e) => (e.currentTarget.src = "/images/creator.jpg")}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {authorId ? (
              <Link
                to={`/creator/${authorId}`}
                className="font-semibold leading-none hover:underline truncate max-w-[14rem] sm:max-w-xs"
              >
                {authorName}
              </Link>
            ) : (
              <span className="font-semibold leading-none truncate">{authorName}</span>
            )}
            {authorHandle && <span className={`text-xs ${textMuted}`}>{authorHandle}</span>}
            {createdLabel && (
              <>
                <span className={`text-xs ${textMuted}`}>•</span>
                <time className={`text-xs ${textMuted}`} dateTime={createdAt || undefined}>
                  {createdLabel}
                </time>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Title */}
      {post?.title && (
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight mb-1 sm:mb-2">
          {post.title}
        </h3>
      )}

      {/* Body */}
      {(post?.content || post?.body) && (
        <p className={`whitespace-pre-wrap leading-7 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
          {post.content || post.body}
        </p>
      )}

      {/* Media */}
      {attachments.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {attachments.map((att, i) => (
            <a
              key={att.publicId || i}
              href={att.url}
              target="_blank"
              rel="noreferrer"
              className="block group"
            >
              <div className="relative w-full overflow-hidden rounded-xl border aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                <img
                  src={att.url}
                  alt={`attachment ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <button
          onClick={handleLikeClick}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition ${
            liked
              ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
              : isDarkMode
              ? "border-gray-600 hover:bg-gray-700 text-gray-200"
              : "border-gray-300 hover:bg-gray-50 text-gray-700"
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50`}
          aria-pressed={liked}
        >
          <Icon.Heart />
          {liked ? "Liked" : "Like"}
          {likeCount ? ` • ${likeCount}` : ""}
        </button>

        <button
          onClick={toggleComment}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition ${
            isDarkMode
              ? "border-gray-600 hover:bg-gray-700 text-gray-200"
              : "border-gray-300 hover:bg-gray-50 text-gray-700"
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50`}
          aria-expanded={openComments}
        >
          <Icon.Message />
          {openComments ? "Hide comments" : "Comment"}
        </button>
      </div>

      {/* Comments */}
      {openComments && (
        <div className="mt-5">
          <CommentsSection postId={post?._id || post?.id} title="Comments" highlightId={highlightId} />
        </div>
      )}
      </div>
    </article>
  );
}